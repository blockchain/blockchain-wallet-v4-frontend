export async function openPopup(route?: string): Promise<void> {
  try {
    let popupURL = chrome.runtime.getURL('index.html')
    if (route) {
      popupURL = `${popupURL}#${route}`
    }

    await chrome.windows.create({
      height: 630,
      type: 'popup',
      url: popupURL,
      width: 360
    })
  } catch (e) {
    // eslint-disable-next-line
    console.log(e)
  }
}
