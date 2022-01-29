/**
 * Calculate the Timeago
 *
 * Requirement: <https://github.com/iamkun/dayjs>
 */

$(function() {
  const attrTimestamp = LocaleHelper.attrTimestamp();
  const attrCapitalize = 'data-capitalize';
  const $timeago = $(".timeago");

  let timeagoTasks = $timeago.length;
  let intervalId = void 0;

  dayjs.locale(LocaleHelper.locale());
  dayjs.extend(window.dayjs_plugin_relativeTime);
  dayjs.extend(window.dayjs_plugin_localizedFormat);

  function relativetime($elem) {
    const now = dayjs();
    const past = dayjs.unix(LocaleHelper.getTimestamp($elem));

    let diffMonth = now.diff(past, 'month', true);
    if (diffMonth > 10) { // year ago range: 11 months to 17months
      $elem.removeAttr(attrTimestamp);
      return past.format('ll'); // see: https://day.js.org/docs/en/display/format#list-of-localized-formats
    }

    let diffMinute = now.diff(past, 'minute', true);
    if (diffMinute > 44) { // an hour ago range: 45 to 89 minutes
      $elem.removeAttr(attrTimestamp);
    }

    return past.fromNow();
  }

  /*  
      * 若文档中已有命名dateFormat，可用dFormat()调用
      * 年(Y) 可用1-4个占位符
      * 月(m)、日(d)、小时(H)、分(M)、秒(S) 可用1-2个占位符
      * 星期(W) 可用1-3个占位符
      * 季度(q为阿拉伯数字，Q为中文数字)可用1或4个占位符
      *
      * let date = new Date()
      * dateFormat("YYYY-mm-dd HH:MM:SS", date)           2020-02-09 14:04:23
      * dateFormat("YYYY-mm-dd HH:MM:SS Q", date)         2020-02-09 14:09:03 一
      * dateFormat("YYYY-mm-dd HH:MM:SS WWW", date)       2020-02-09 14:45:12 星期日
      * dateFormat("YYYY-mm-dd HH:MM:SS QQQQ", date)      2020-02-09 14:09:36 第一季度
      * dateFormat("YYYY-mm-dd HH:MM:SS WWW QQQQ", date)  2020-02-09 14:46:12 星期日 第一季度
  */
  function dateFormat(format, date) {
    let we = date.getDay();                                 // 星期
    let qut = Math.floor((date.getMonth() + 3) / 3).toString(); // 季度
    const opt = {
      "Y+": date.getFullYear().toString(),                 // 年
      "m+": (date.getMonth() + 1).toString(),                // 月(月份从0开始，要+1)
      "d+": date.getDate().toString(),                     // 日
      "H+": date.getHours().toString(),                    // 时
      "M+": date.getMinutes().toString(),                  // 分
      "S+": date.getSeconds().toString(),                  // 秒
      "q+": qut, // 季度
    };
    const week = {      // 中文数字 (星期)
      "0": "日",
      "1": "一",
      "2": "二",
      "3": "三",
      "4": "四",
      "5": "五",
      "6": "六"
    };
    const quarter = {   // 中文数字（季度） 
      "1": "一",
      "2": "二",
      "3": "三",
      "4": "四",
    };
    if (/(W+)/.test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' + week[we] : '周' + week[we]) : week[we]))
    };
    if (/(Q+)/.test(format)) {
      // 输入一个Q，只输出一个中文数字，输入4个Q，则拼接上字符串 
      format = format.replace(RegExp.$1, (RegExp.$1.length == 4 ? '第' + quarter[qut] + '季度' : quarter[qut]));
    };
    for (let k in opt) {
      let r = new RegExp("(" + k + ")").exec(format);
      if (r) {
        // 若输入的长度不为1，则前面补零
        format = format.replace(r[1], (RegExp.$1.length == 1 ? opt[k] : opt[k].padStart(RegExp.$1.length, '0')))
      }
    };
    return format;
  };

  function updateTimeago() {
    $timeago.each(function() {
      if (typeof $(this).attr(attrTimestamp) === 'undefined') {
        timeagoTasks -= 1;
        return;
      }

      let relativeTime = relativetime($(this));
      const capitalize = $(this).attr(attrCapitalize);
      if (typeof capitalize !== 'undefined' && capitalize === 'true') {
        relativeTime = relativeTime.replace(/^\w/, (c) => c.toUpperCase());
      }

      if ($(this).text() !== relativeTime) {
        $(this).text(relativeTime);
      }
    });

    if (timeagoTasks === 0 && typeof intervalId !== "undefined") {
      clearInterval(intervalId); /* stop interval */
    }

    return timeagoTasks;
  }

  function setupTooltips() {
    $timeago.each(function() {
      const tooltip = $(this).attr('data-toggle');
      if (typeof tooltip === 'undefined' || tooltip !== 'tooltip') {
        return;
      }

      const df = $(this).attr('data-tooltip-df');
      const ts = LocaleHelper.getTimestamp($(this));
      const dateStr = dayjs.unix(ts).format(df);
      $(this).attr('data-original-title', dateStr);
      $(this).removeAttr('data-tooltip-df');
    });
  }

  if (timeagoTasks === 0) {
    return;
  }

  setupTooltips();

  if (updateTimeago()) { /* run immediately */
    intervalId = setInterval(updateTimeago, 60 * 1000); /* run every minute */
  }

});
