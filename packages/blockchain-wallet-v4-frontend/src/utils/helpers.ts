import { prop } from 'ramda'

import { UTM } from 'middleware/analyticsMiddleware/constants'

export const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      // @ts-ignore
      func.apply(this, args)
    }, wait)
  }
}

// React.memo still renders whenever it feels like it so this memoizer
// gives you more more control to guarentee no unwanted rendering
export const memoizer = (component) => {
  const cached = {}

  return function (args) {
    const key = JSON.stringify(args)
    if (!cached[key]) {
      cached[key] = component(args)
    }
    return cached[key]
  }
}

export const checkHasWebcam = () => {
  const media = navigator.mediaDevices
  if (!prop('enumerateDevices', media)) return Promise.resolve(false)

  return media
    .enumerateDevices()
    .then((devices) => devices.some((device) => device.kind === 'videoinput'))
}

export const collapse = (text: string | undefined) =>
  text ? (text.length > 30 ? text.replace(/(.{17})..+/, '$1…') : text) : 'N/A'

export const hexToRgb = (colour) => {
  let r
  let g
  let b
  if (colour.charAt(0) === '#') {
    /* eslint-disable-next-line */
    colour = colour.substr(1)
  }
  if (colour.length === 3) {
    /* eslint-disable-next-line */
    colour =
      colour.substr(0, 1) +
      colour.substr(0, 1) +
      colour.substr(1, 2) +
      colour.substr(1, 2) +
      colour.substr(2, 3) +
      colour.substr(2, 3)
  }
  r = `${colour.charAt(0)}${colour.charAt(1)}`
  g = `${colour.charAt(2)}${colour.charAt(3)}`
  b = `${colour.charAt(4)}${colour.charAt(5)}`
  r = parseInt(r, 16)
  g = parseInt(g, 16)
  b = parseInt(b, 16)
  return `${r}, ${g}, ${b}`
}

export const toBase64 = (file: File): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    // @ts-ignore
    reader.onload = () => resolve(reader?.result?.toString())
    reader.onerror = (error) => reject(error)
  })
}

/*
  Analytics usage without redux store coupling.
*/
export const analyticsTrackingNoStore = async (data) => {
  const res = await fetch('/wallet-options-v4.json')
  const options = await res.json()
  const analyticsURL = `${options.domains.api}/events/publish`
  const rawCampaign = sessionStorage.getItem(UTM)
  const campaign = rawCampaign ? JSON.parse(rawCampaign) : {}

  await fetch(analyticsURL, {
    body: JSON.stringify({
      context: campaign,
      device: 'WEB',
      events: [],
      platform: 'WALLET',
      // Just pass in a data object to re-write
      // any of the body params
      ...data
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}
