import Bowser from 'bowser'

export const getBrowserNameAndVersion = () => {
  const browser = Bowser.getParser(window.navigator.userAgent)
  return `${browser.getBrowserName()} ${browser.getBrowserVersion()}`
}

export const isBrowserSupported = () => {
  const browser = Bowser.getParser(window.navigator.userAgent)
  // let search crawlers through for SEO purposes
  if (browser.getPlatformType() === 'bot') return true
  // handle edge case where user's mobile device is motoroal edge
  // and bowser assumes it is microsoft edge
  if (
    browser.getOSName() === 'Android' &&
    (browser.getOSVersion() === '12' || browser.getOSVersion() === '11') &&
    browser.getBrowserName() === 'Microsoft Edge'
  ) {
    return true
  }
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
