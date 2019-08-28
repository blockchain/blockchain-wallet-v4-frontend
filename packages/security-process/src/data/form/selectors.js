import {
  getFormValues,
  getFormInitialValues,
  getFormSyncErrors,
  getFormMeta,
  getFormAsyncErrors,
  getFormSyncWarnings,
  getFormSubmitErrors,
  getFormError,
  getFormNames,
  isDirty,
  isPristine,
  isValid,
  isInvalid,
  isSubmitting,
  hasSubmitSucceeded,
  hasSubmitFailed
} from 'redux-form'
import {
  compose,
  head,
  defaultTo,
  keys,
  path,
  propEq,
  pickBy,
  split
} from 'ramda'

const getActiveField = formName => state =>
  compose(
    defaultTo(null),
    head,
    keys,
    pickBy(propEq('active', true)),
    getFormMeta(formName)
  )(state)

const isAsyncValidating = formName => state => {
  const formPath = split('.', formName)
  return path(['form', ...formPath, 'asyncValidating'], state)
}

export {
  getActiveField,
  getFormValues,
  getFormInitialValues,
  getFormSyncErrors,
  getFormMeta,
  getFormAsyncErrors,
  getFormSyncWarnings,
  getFormSubmitErrors,
  getFormError,
  getFormNames,
  isDirty,
  isPristine,
  isValid,
  isInvalid,
  isSubmitting,
  isAsyncValidating,
  hasSubmitSucceeded,
  hasSubmitFailed
}
