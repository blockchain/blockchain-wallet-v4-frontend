import * as AT from './actionTypes'

export {
  arrayInsert,
  arrayMove,
  arrayPop,
  arrayPush,
  arrayRemove,
  arrayRemoveAll,
  arrayShift,
  arraySplice,
  arraySwap,
  arrayUnshift,
  autofill,
  blur,
  change,
  clearAsyncError,
  clearFields,
  clearSubmitErrors,
  destroy,
  focus,
  initialize,
  registerField,
  reset,
  resetSection,
  setSubmitFailed,
  setSubmitSucceeded,
  startAsyncValidation,
  startSubmit,
  stopAsyncValidation,
  stopSubmit,
  submit,
  touch,
  unregisterField,
  untouch,
  updateSyncErrors
} from 'redux-form'

export const change2 = (form, field, value) => ({
  payload: { field, form, value },
  type: AT.CHANGE2
})
