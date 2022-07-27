// @ts-nocheck
import { openPopup } from 'plugin/internal/browser'
import { clearSession, isSessionActive } from 'plugin/internal/chromeStorage'
import { TabMetadata } from 'plugin/internal/index'
import { ConnectionEvents, ProviderMessage, RequestArguments } from 'plugin/provider/types'
import { SupportedRPCMethods } from 'plugin/provider/utils'

chrome.runtime.onInstalled.addListener(function () {
  // eslint-disable-next-line
  chrome.tabs.create({ url: chrome.runtime.getURL('index-tab.html') }).catch((err) => console.log(err))
})

chrome.runtime.onConnect.addListener(function (port: chrome.runtime.Port) {
  port.postMessage({ data: { chainId: '1' }, type: ConnectionEvents.Connected })

  const metadata: TabMetadata = {
    favicon: port.sender?.tab?.favIconUrl,
    origin: port.name
  }

  const listener = (msg: ProviderMessage) => {
    port.postMessage(msg)

    chrome.runtime.onMessage.removeListener(listener)
  }

  port.onMessage.addListener(async function (msg: RequestArguments) {
    // try {
    //   const isCurrentSessionActive = await isSessionActive()
    //   if (!isCurrentSessionActive) {
    //     await clearSession()
    //     port.postMessage({
    //       data: 'BCDC session expired. Please reauthenticate',
    //       type: ConnectionEvents.Error
    //     })
    //     await chrome.tabs.create({ url: chrome.runtime.getURL('index-tab.html') })
    //   }
    // } catch (e) {
    //   port.postMessage({
    //     data: e.message,
    //     type: ConnectionEvents.Error
    //   })
    // }

    switch (msg.method) {
      case SupportedRPCMethods.RequestAccounts:
        chrome.runtime.onMessage.addListener(listener)

        // eslint-disable-next-line
        openPopup(`/plugin/connect-dapp?domain=${metadata.origin}&favicon=${metadata.favicon}`).catch((e) => console.log(e))
        break
      default:
    }
  })
})
