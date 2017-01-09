/**
 * Yanzu create at 2016-12-31 13:00
 */
export function formatDate(date, fmt) {
  if(/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  let o = {
    'M+': date.getMonth() + 1, // 月份从 0 开始
    'd+': date.getDate(), // 天数
    'h+': date.getHours(), // 小时数
    'm+': date.getMinutes(), // 分钟数
    's+': date.getSeconds() // 秒数
  }

  for(let k in o) {
    if(new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '' // 把它先转为字符串类型
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }

  return fmt // 把最终想要的时间戳格式返回去
}

function padLeftZero(str) { // 如果要转化的时间戳值小于 0，就在最左边补个 0
  return ('00' + str).substr(str.length)
}
