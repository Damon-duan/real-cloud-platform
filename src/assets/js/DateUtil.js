let dateFormat = function (date, fmt) {
  if (!date) {
    return ''
  }
  try {
    date = date.trim().replace(/\s+/, 'T')
    date = new Date(date + '+08:00')
  } catch (e) {
    date = new Date(date)
  }
  if (date === 'Invalid Date') {
    console.error('asen:时间转化错误：' + date)
    return date
  }
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  let week = {
    '0': '/u65e5',
    '1': '/u4e00',
    '2': '/u4e8c',
    '3': '/u4e09',
    '4': '/u56db',
    '5': '/u4e94',
    '6': '/u516d'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '/u661f/u671f' : '/u5468') : '') + week[date.getDay() + ''])
  }
  for (let k in o) {
    if (!o.hasOwnProperty(k)) {
      continue
    }
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
export default {
  /**
   * new Date().format("yyyy-MM-dd HH:mm:ss");
   * @param date
   * @param fmt
   * @returns {*}
   */
  format: dateFormat,
  dateRange: function (text) {
    if (!text) {
      return []
    }
    let now = new Date()
    let startFormat = 'yyyy-MM-dd 00:00:00'
    let endFormat = 'yyyy-MM-dd 23:59:59'
    let start = new Date()
    let end = new Date()

    switch (text) {
      case 'today':
        start = now
        break
      case 'yesterday':
        end = start = now.setDate(now.getDate() - 1)
        break
      case 'latestWeek':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
        break
      case 'latestMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
    }

    return [dateFormat(start, startFormat), dateFormat(end, endFormat)]
  }
}
