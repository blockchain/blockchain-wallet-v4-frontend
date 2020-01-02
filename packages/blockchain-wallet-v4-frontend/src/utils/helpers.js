import { isNil } from 'ramda'

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

export const hasWebcam = () => {
  if (isNil(navigator.mediaDevices)) {
    navigator.mediaDevices = {}
  }

  if (isNil(navigator.mediaDevices.getUserMedia)) {
    navigator.mediaDevices.getUserMedia = constraints => {
      var getUserMedia =
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia

      if (!getUserMedia) {
        return Promise.reject(
          new Error('getUserMedia is not implemented in this browser')
        )
      }

      return new Promise((resolve, reject) =>
        getUserMedia.call(navigator, constraints, resolve, reject)
      )
    }
  }

  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(stream => {
      var video = document.querySelector('video')

      if ('srcObject' in video) {
        video.srcObject = stream
      } else {
        video.src = window.URL.createObjectURL(stream)
      }

      video.onloadedmetadata = () => {
        video.play()
      }
    })
    .catch(error => error.message)
}

export const getMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

export const collapse = text =>
  text.length > 30 ? text.replace(/(.{17})..+/, '$1…') : text
