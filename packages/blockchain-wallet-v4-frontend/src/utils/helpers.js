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
  if (!media || !media.enumerateDevices) return false

  return media
    .enumerateDevices()
    .then(devices => devices.some(device => device.kind === 'videoinput'))
}

export const getMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

export const collapse = text =>
  text.length > 30 ? text.replace(/(.{17})..+/, '$1…') : text
