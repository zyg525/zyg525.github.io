/**
 * Hightlight specifiled lines
 */

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
