/**
 * 解析 url 参数 urlParse()
 * @example ?id=12345&a=b
 * @return Object {id:13245,a:b}
 */
export function urlParse() {
  let url = window.location.search // 获取传的参数 @example ?id=12345&a=b
  let obj = {} // 最终返回的对象
  let reg = /[?&][^?&]+=[^?&]+/g // 解析 url 正则
  let arr = url.match(reg) // 获取解析 url 后的结果数组

  // arr = ['?id=12345', '&a=b']
  if(arr) {
    for(let item of arr) { // es6 遍历数组 api
      let tempArr = item.substring(1).split('=') // 去掉返回值的第一个字符并以 =号 分隔
      let key = decodeURIComponent(tempArr[0]) // 返回值的 key
      let val = decodeURIComponent(tempArr[1]) // 返回值的 value

      obj[key] = val // 把 key 对应的 val 存进obj
    }
  }
  
  return obj // 返回这个最终对象
}
