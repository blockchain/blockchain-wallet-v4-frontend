import { useEffect, useRef, useState } from 'react'

/**
 * limits your function to be called at most every W milliseconds, where W is wait.
 * Calls over W get dropped.
 * Thanks to Pat Migliaccio.
 * see https://medium.com/@pat_migliaccio/rate-limiting-throttling-consecutive-function-calls-with-queues-4c9de7106acc
 * @param fn
 * @param wait
 * @example let throttledFunc = throttle(myFunc,500);
 */
function throttle(fn: Function, wait: number) {
  let isCalled = false

  return function (...args) {
    if (!isCalled) {
      fn(...args)
      isCalled = true
      setTimeout(function () {
        isCalled = false
      }, wait)
    }
  }
}

/**
 * Check if an element is in viewport

 * @param {number} offset - Number of pixels up to the observable element from the top
 * @param {number} throttleMilliseconds - Throttle observable listener, in ms
 */
export default function useVisibility<Element extends HTMLElement>(
  offset = 0,
  throttleMilliseconds = 100
): [Boolean, React.RefObject<Element>] {
  const [isVisible, setIsVisible] = useState(false)
  const currentElement = useRef<Element>()

  const onScroll = throttle(() => {
    if (!currentElement.current) {
      setIsVisible(false)
      return
    }
    const { top } = currentElement.current.getBoundingClientRect()
    setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight)
  }, throttleMilliseconds)

  useEffect(() => {
    document.addEventListener('scroll', onScroll, true)
    return () => document.removeEventListener('scroll', onScroll, true)
  })

  return [isVisible, currentElement as React.RefObject<Element>]
}
