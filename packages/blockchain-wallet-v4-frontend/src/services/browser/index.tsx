import Bowser from 'bowser'

export const isBrowserSupported = () => {
  const browser = Bowser.getParser(window.navigator.userAgent)
  return browser.satisfies({
    chrome: '>60',
    chromium: '>60',
    edge: '>17',
    firefox: '>60',
    opera: '>50',
    safari: '>11',
    vivaldi: '>3'
  })
}

export const isBrowserSafari = () => {
  const browser = Bowser.getParser(window.navigator.userAgent)
  return browser.satisfies({
    safari: '>11'
  })
}
