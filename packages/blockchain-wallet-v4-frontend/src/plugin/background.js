// eslint-disable-next-line no-undef
chrome.runtime.onInstalled.addListener(function () {
  // eslint-disable-next-line no-undef
  chrome.tabs.create({ url: chrome.runtime.getURL('plugin-tab.html') })
})
