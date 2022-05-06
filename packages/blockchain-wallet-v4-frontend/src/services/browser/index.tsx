import Bowser from 'bowser'

export const getBrowserNameAndVersion = () => {
  const browser = Bowser.getParser(window.navigator.userAgent)
  debugger
  console.log(browser)
  return browser
}

export const isBrowserSupported = () => {
  const browser = Bowser.getParser(window.navigator.userAgent)
  return browser.satisfies({
    chrome: '>80', // chromium
    chromium: '>80', // chromium
    edge: '>80', // chromium
    firefox: '>80', // chromium
    opera: '>66', // chromium non-standard versioning
    safari: '>12', // webkit
    vivaldi: '>4' // chromium non-standard versioning
  })
}

export const isBrowserSafari = () => {
  const browser = Bowser.getParser(window.navigator.userAgent)
  return browser.satisfies({
    safari: '>12'
  })
}
