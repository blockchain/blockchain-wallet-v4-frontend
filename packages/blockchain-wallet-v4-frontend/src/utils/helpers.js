import { prop } from 'ramda'

export const debounce = (func, wait) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      timeout = null
      func.apply(this, args)
    }, wait)
  }
}

export const checkHasWebcam = () => {
  let media = navigator.mediaDevices
  if (!prop('enumerateDevices', media)) return false

  return media
    .enumerateDevices()
    .then(devices => devices.some(device => device.kind === 'videoinput'))
}

export const collapse = text =>
  text.length > 30 ? text.replace(/(.{17})..+/, '$1…') : text
