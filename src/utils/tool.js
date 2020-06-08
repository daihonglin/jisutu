/**
 * 函数防抖 (只执行最后一次点击)
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export const Debounce = (fn, t) => {
  const delay = t || 500 // 如果传入事件, 按照指定事件
  let timer // 定义一个变量
  console.log(fn)
  console.log(typeof fn)
  return function () {
    // 将来就是让这里的函数执行多次
    if (timer) {
      clearTimeout(timer) // 如果已经有定时器, 就清除定时器
    }
    timer = setTimeout(() => {
      timer = null // 清除变量的值, 恢复变量初始状态
      fn() // 这里的函数每个多少秒执行一次 优化了性能
      console.log(timer)
    }, delay)
  }
}
/**
* 函数节流
* @param fn
* @param interval
* @returns {Function}
* @constructor
*/
export const Throttle = (fn, t) => {
  let last // 定义一个变量, 记录开始时间
  let timeId // 定义一个变量用来存储id
  const interval = t || 1000 // 如果没有传递时间, 取默认时间
  return function () {
    const now = +new Date() // 取当前事件戳
    // 如果用户一直在移动 last就不会改变, 所以当超过一秒钟时就会执行下面的函数
    if (last && now - last < interval) { // 如果last存在且还在间隔时间内又触发了事件
      // 清除之前的定时器
      if (timeId) {
        clearTimeout(timeId)
      }
      // 如果这个函数没有机会执行的话, last就不会改变, 最终还是会执行else
      timeId = setTimeout(() => { // 重新开启一个新的定时器
        last = null // 恢复变量初始值, 方便下次使用
        timeId = null // 恢复变量初始值, 方便下次使用
        console.log('最后一次')
        fn() // 调用函数
      }, interval)
    } else {
      // 如果是第一次移动,记录移动的时间 就直接调用函数
      // 如果不是第一次移动, 但是事件间隔大于 interval 也记录移动的时间, 直接调用函数
      console.log('执行我了')
      last = now
      fn() // 获取初始位置
    }
  }
}
