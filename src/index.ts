import { isChineseIDCardNumber } from './isChineseIDCardNumber'

const ua = navigator.userAgent

/**
 * 功能：解析字符串参数
 * 解析字符串参数（1.location.search; 2.location.hash; 3.queryString字符串）
 * 重复参数将以数组的形式返回 ps: ?user=tom&user=jerry => {user: ['tome', 'jerry']}
 * @param {String} queryString 通过'='分隔的参数字符串
 * @return {Object} 返回参数对象
 */
export const parseQuery = (queryString: string = '') => {
  const res: any = {}
  const { search, hash } = location
  const hashStr = hash.split('?') && hash.split('?')[1]
  let query = `${search}${hashStr ? '&' + hashStr : ''}`
  if (queryString) query = queryString
  query = query.trim().replace(/^(\?|#|&)/, '')

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    const parts = param.replace(/\+/g, ' ').split('=')
    const key = decodeURIComponent(parts.shift())
    const val = parts.length > 0
      ? decodeURIComponent(parts.join('='))
      : null

    if (res[key] === undefined) {
      res[key] = val
    } else if (Array.isArray(res[key])) {
      res[key].push(val)
    } else {
      res[key] = [res[key], val]
    }
  })

  return res
}

/**
 * 功能：首字母转大写
 * @param str word
 */
export const capitalization = (str: String): String => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 功能：异步加载js文件
 * @param src URL
 */
export const loadApi = (src: string) => {
  return new Promise((resolve, reject) => {
    const script: HTMLScriptElement = document.createElement('script')
    script.src = src
    script.async = true
    document.head.appendChild(script)

    script.onload = () => { resolve() }
    script.onerror = (err) => { reject(err) }
  })
}

/**
 * 功能：过滤空值参数 null | undefined | ''
 * @param{Object} query 参数对象
 */
export const filterEmptyParams = (query: Object) => {
  const res: any = {}
  for (const [key, val] of Object.entries(query)) {
    if (typeof val === 'string') {
      if (!val.trim() || val === 'null') continue
    } else {
      if (val === null || val === undefined) continue
    }
    res[key] = val
  }
  return res
}

/**
 * 功能：车牌号验证 新能源 + 非新能源
 * @param value 车牌号
 */
export const isLicensePlateNumber = (val: string): (boolean | string) => {
  console.log(`车牌号：${val}`)
  return !val
    ? val
    : /^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/g.test(val.toUpperCase())
}

/**
 * 功能：身份证号验证
 * @param value 身份证号
 */
export const isIDCardNew = (value: string) => /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}[\dXx]$/g.test(value)
/**
 * 功能：金额格式化 千分位，保留小数
 * @param{Number} num 金额
 * @param{Number} digits 保留小数位数
 */
export const formatMoney = (num: number, digits: number = 2) => num.toFixed(digits).replace(/\B(?=(\d{3})+(?!\d))/g, ',')

/**
 * 功能：生成制定范围的随机整数
 * @param min 最小值
 * @param max 最大值
 */
export const randomNum = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

/**
 * 功能：html转义（防止xss攻击）
 * @param str html字符串
 */
export const escapeHTML = (str: string) => {
  return !str
    ? str
    : str.replace(
      /[&<>'"]/g,
      (tag: string) => {
        const obj: Record<string, string> = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;',
        }
        return obj[tag] || tag
      }
    )
}

/**
 * 功能：系统类型检测
 * @param type 系统类型
 */
export const osType = (type: string) => {
  interface IAnyObject {
    [propName: string]: any
  }
  const obj: IAnyObject = {
    Android: /android/i,
    IOS: /(ipad|iphone|ipod)/i,
    WeChat: /MicroMessenger/i,
  }
  return obj[type] && obj[type].test(ua)
}

/**
 * 功能：判断是否为IOS系统
 */
export const isIOS = () => {
  return osType('IOS')
}

/**
 * 功能：判断是否为Android系统
 */
export const isAndroid = () => {
  return osType('Android')
}

export const isWeChat = () => {
  return osType('WeChat')
}

/**
 * 功能：获取系统环境
 */
export const osEnv = () => (
  {
    iOS: isIOS(),
    android: isAndroid(),
    weChat: isWeChat(),
  }
)

/**
 * 功能：手机号验证
 * @param val 手机号
 */
export const isMobileNumber = (val: string | number) => {
  const re = /^1[3-9]\d[9]/
  return re.test(String(val))
}

/**
 * 功能：休眠函数 等待一段时间再执行下面的代码
 * @param msec ms
 */
export const sleep = (msec: number) => {
  return new Promise<void>(resolve => setTimeout(resolve, msec))
}

export default {
  capitalization,
  parseQuery,
  query: parseQuery(),
  loadApi,
  filterEmptyParams,
  osEnv: osEnv(),
  isChineseIDCardNumber,
  isMobileNumber,
  sleep,
}
