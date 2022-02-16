---
title: "为使用 Rouge 的 Jekyll 主题添加高亮指定行的功能"
date: 2022-2-16 18:39:09 +0800
categories: [教程, 网站]
tags: [jekyll, 教程, 网站, javascript]     # TAG names should always be lowercase
---

## 前言

实际上，这个功能在 Jekyll 的 Issue [#8621](https://github.com/jekyll/jekyll/issues/8621) 上早有讨论，但是时至今日这个功能迟迟没有进展。

相关的讨论者提出了一些简易的 Ruby 脚本，但是这些脚本功能并不完整，例如不支持行号。但是奈何本人又不会 Ruby，只能考虑另辟蹊径，通过 JS 来实现行高亮。

对比：

1. Ruby 脚本在生成站点时静态地添加高亮块，没有运行时时间成本。JS 脚本在浏览者打开网页时才动态的添加高亮块，有一定的运行时时间成本。
2. Ruby 脚本使用 Rouge 的参数接口来实现高亮指定行。而 JS 脚本则完全靠自己解析属性值，再动态地增加高亮块。

可见 JS 脚本是有比较大的局限性的，如果有比较合适的 Ruby 脚本，还是使用 Ruby 的好。

## 实现思路

1. 通过 Kramdown 的语法为代码框增加属性：
{% raw %}
    ````markdown
    ```c
    int main(int argc, char* argv[]) {
        return 0;
    }
    ```
    {: highlight-lines="2" }
    ````
{% endraw %}

    `highlight-lines` 支持复数行的选择，例如 `highlight-lines="2-4, 7, 9-16, 21"`。
2. 在 JS 中，通过正则匹配，将 `highlight-lines` 的值拆为具体的行数，例如将 `"2-4, 7, 9-16, 21"` 拆成 `[2, 3, 4, 7, 9, 10, 11, 12, 13, 14, 15, 16, 21]`。
3. 找到最后一个 `<pre>` 子元素（因为行号也是一个 `<pre>`）。
4. 遍历所有子元素（使用 `nextSibling` 而不是 `nextElementSibling`，因为我们要匹配纯字符元素）。当遇到 `\n` 时，计算行数加一，如果当前行数在高亮行的列表中，则新增一个 `class="hll"` 的 `<span>` 元素，直到遇到下一个 `\n` 为止，将一行内所有元素都加入其中。
5. 在需要的页面中调用该脚本，所有高亮行会被 `<span class="hll">` 元素包裹。
6. 在 CSS 中为 `.hll` 配置背景色。

具体实现可参考（比较烂，感觉优化空间挺大）：

```javascript
$(function () {
    $(".highlighter-rouge").each(function () {
        const attr_highlight_lines = $(this).attr("highlight-lines");
        if (attr_highlight_lines && attr_highlight_lines.length > 0) {
            let lines = [];
            let scopes = ("," + attr_highlight_lines).match(/(?<=\s|,)\d+(-\d+)?/g)
            scopes.forEach(function (val) {
                let pos = val.split('-');
                let start = parseInt(pos[0]);
                if (pos.length > 1) {
                    let end = parseInt(pos[1]);
                    if (end >= start) {
                        for (let i = start; i <= end; i++) {
                            lines.push(i);
                        }
                    }
                } else if (pos.length == 1) {
                    lines.push(start);
                }
            })
            let pre = $("pre", $(this));
            pre = pre[pre.length - 1];
            let current_line = 1;
            let in_hll = false;
            let hll_node = null;
            for (let cur = pre.firstChild; cur != null; cur = cur.nextSibling) {
                if (cur.nodeType == Node.TEXT_NODE) {
                    let count = (cur.nodeValue.match(/\n/g) || []).length;
                    if (count > 0) {
                        in_hll = false;
                        current_line += count;
                    } else if (count == 0 && in_hll) {
                        hll_node.appendChild(cur);
                        cur = hll_node;
                    }
                } else if (lines.includes(current_line)) {
                    if (!in_hll) {
                        hll_node = document.createElement("span");
                        hll_node.setAttribute("class", "hll");
                        pre.insertBefore(hll_node, cur);
                        in_hll = true;
                        if (hll_node.previousSibling.nodeType == Node.TEXT_NODE) {
                            hll_node.appendChild(hll_node.previousSibling);
                        }
                    }
                    hll_node.appendChild(cur);
                    cur = hll_node;
                }
            }
        }
    })
});
```

CSS 配置：

```css
.highlighter-rouge .hll { background-color: #ffff83; }
```

## 例子

````markdown
```rust
fn r<A, R>(g: impl Fn(&dyn Fn(A) -> R, A) -> R) -> impl Fn(A) -> R {
    fn r_inner<'a, A, R>(g: &'a dyn Fn(&dyn Fn(A) -> R, A) -> R) -> impl Fn(A) -> R + 'a {
        move |x| g(&r_inner(g), x)
    }
    move |x| r_inner(&g)(x)
}

fn main() {
    let g = |f: &dyn Fn(usize) -> usize, x| match x {
        0 => 1,
        _ => x * f(x - 1),
    };

    let fact = r(g);
    println!("{}", fact(5)); // 将会输出 120
}
```
{: highlight-lines="3, 9-12" }
````

效果：

```rust
fn r<A, R>(g: impl Fn(&dyn Fn(A) -> R, A) -> R) -> impl Fn(A) -> R {
    fn r_inner<'a, A, R>(g: &'a dyn Fn(&dyn Fn(A) -> R, A) -> R) -> impl Fn(A) -> R + 'a {
        move |x| g(&r_inner(g), x)
    }
    move |x| r_inner(&g)(x)
}

fn main() {
    let g = |f: &dyn Fn(usize) -> usize, x| match x {
        0 => 1,
        _ => x * f(x - 1),
    };

    let fact = r(g);
    println!("{}", fact(5)); // 将会输出 120
}
```
{: run="rust" }
{: highlight-lines="3, 9-12" }
