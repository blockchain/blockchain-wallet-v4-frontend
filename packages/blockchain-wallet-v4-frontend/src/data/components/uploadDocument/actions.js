import * as AT from './actionTypes'

export const upload = (token, files) => ({
  type: AT.UPLOAD,
  payload: { files, token }
})

export const setUploaded = () => {
  return { type: AT.SET_UPLOADED }
}
