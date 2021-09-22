import { prop } from 'ramda'

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
    reader.onload = () => resolve(reader?.result?.toString())
    reader.onerror = (error) => reject(error)
  })
}
