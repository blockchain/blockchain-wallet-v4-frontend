import { WindowPostMessageStream } from '@metamask/post-message-stream'
import { AbstractPlugin } from 'plugin/internal'
import { ConnectionEvents, ProviderMessage, RequestArguments } from 'plugin/provider/types'
import { Duplex } from 'stream'

export const CONTENT_SCRIPT = 'bcdc-contentscript'
export const INPAGE = 'bcdc-inpage'

/**
 * Checks the doctype of the current document if it exists
 */
function doctypeCheck(): boolean {
  const { doctype } = window.document
  if (doctype) {
    return doctype.name === 'html'
  }
  return true
}

/**
 * Returns whether or not the extension (suffix) of the current document is prohibited
 *
 * This checks {@code window.location.pathname} against a set of file extensions
 * that we should not inject the provider into.
 */
function suffixCheck(): boolean {
  const prohibitedTypes = [/\.xml$/u, /\.pdf$/u]
  const currentUrl = window.location.pathname
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < prohibitedTypes.length; i++) {
    if (prohibitedTypes[i].test(currentUrl)) {
      return false
    }
  }
  return true
}

/**
 * Checks the documentElement of the current document
 */
function documentElementCheck(): boolean {
  const documentElement = document.documentElement.nodeName
  if (documentElement) {
    return documentElement.toLowerCase() === 'html'
  }
  return true
}

/**
 * Checks if the current domain is blocked
 */
function blockedDomainCheck(): boolean {
  // Metamask uses this list of blocked domains.
  const blockedDomains = [
    'uscourts.gov',
    'dropbox.com',
    'webbyawards.com',
    'cdn.shopify.com/s/javascripts/tricorder/xtld-read-only-frame.html',
    'adyen.com',
    'gravityforms.com',
    'harbourair.com',
    'ani.gamer.com.tw',
    'blueskybooking.com',
    'sharefile.com'
  ]
  const currentUrl = window.location.href
  let currentRegex

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < blockedDomains.length; i++) {
    const blockedDomain = blockedDomains[i].replace('.', '\\.')
    currentRegex = new RegExp(`(?:https?:\\/\\/)(?:(?!${blockedDomain}).)*$`, 'u')
    if (!currentRegex.test(currentUrl)) {
      return true
    }
  }
  return false
}

/**
 * Determines if the provider should be injected
 */
function shouldInjectProvider(): boolean {
  return (
    doctypeCheck() &&
    suffixCheck() &&
    documentElementCheck() &&
    !blockedDomainCheck() &&
    !AbstractPlugin.isPlugin()
  )
}

/**
 * Sets up two-way communication streams between the
 * browser extension and local per-page browser context.
 */
function setupStreams(): void {
  try {
    // The transport-specific streams for communication between inpage and content script
    const pageStream = new WindowPostMessageStream({
      name: CONTENT_SCRIPT,
      target: INPAGE
    }) as unknown as Duplex

    // Port connection to extension background.
    const extensionPort = chrome.runtime.connect('mpbcaidbpdnhhoikpmdigbkeamnkaoak', {
      name: window.location.origin
    })

    // Emit close event when content script gets disconnected from extension background.
    extensionPort.onDisconnect.addListener(() => {
      pageStream.write({ data: null, type: ConnectionEvents.Disconnected })
    })

    // Send message to extension background on message from injected script.
    pageStream.on('data', (data: RequestArguments) => extensionPort.postMessage(data))

    // Send message to injected script on message from extension background.
    extensionPort.onMessage.addListener((msg: ProviderMessage) => pageStream.write(msg))
  } catch (e) {
    // eslint-disable-next-line
    console.log(e)
  }
}

/**
 * Injects a script tag into the current document
 */
function injectScript(): void {
  if (shouldInjectProvider()) {
    try {
      const container = document.head || document.documentElement
      const scriptTag = document.createElement('script')
      const source = chrome.runtime.getURL('inpage.js')
      scriptTag.setAttribute('async', 'false')
      scriptTag.setAttribute('src', source)
      container.insertBefore(scriptTag, container.children[0])
      container.removeChild(scriptTag)

      setupStreams()
    } catch (error) {
      if (error.message.includes('chrome.runtime.getURL is not a function')) {
        // TODO: investigate why content script is being executed twice
        return
      }

      // eslint-disable-next-line
      console.log(error)
    }
  }
}

injectScript()
