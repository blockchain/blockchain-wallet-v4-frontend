import React from 'react'
import bip39 from 'bip39'
import {
  isNumeric,
  isEmail,
  isDOB,
  isGuid,
  isUsZipcode,
  isIpValid,
  isAlphaNumeric,
  isOverEighteen,
  isSSN
} from 'services/ValidationHelper'

import isObject from 'isobject'
import { isValidIBAN, isValidBIC } from 'ibantools'
import { isValidNumber } from 'libphonenumber-js'
import { validate } from 'postal-codes-js'
import postalCodes from 'postal-codes-js/generated/postal-codes-alpha2'
import { utils } from 'blockchain-wallet-v4/src'
import * as M from './validationMessages'
import { all, any, concat, equals, path, takeWhile, prop, propOr } from 'ramda'

export const required = value => (value ? undefined : <M.RequiredMessage />)

export const optional = validator => value =>
  value === undefined || value === '' ? undefined : validator(value)

export const termsCheckBoxChecked = value =>
  value ? undefined : <M.UnacceptedTermsMessage />

export const validNumber = value =>
  isNumeric(value) ? undefined : <M.InvalidNumberMessage />

export const requiredNumber = value =>
  isNumeric(value) && value > 0 ? undefined : <M.RequiredNumberMessage />

export const validEmail = value =>
  isEmail(value) ? undefined : <M.InvalidEmailMessage />

export const validEmailNotAllowed = value =>
  isEmail(value) ? <M.ValidEmailNotAllowed /> : undefined

export const validMnemonic = value =>
  bip39.validateMnemonic(value) ? undefined : <M.InvalidPassphraseMessage />

export const validWalletId = value =>
  isGuid(value) ? undefined : <M.InvalidWalletIdMessage />

export const validMobileNumber = value =>
  isValidNumber(value) ? undefined : <M.InvalidMobileNumberMessage />

export const validIpList = ipList => {
  return !ipList || all(isIpValid)(ipList.split(',')) ? (
    undefined
  ) : (
    <M.InvalidIpListMessage />
  )
}

export const validPasswordConfirmation = passwordFieldName => (
  value,
  allValues
) =>
  value === allValues[passwordFieldName] ? undefined : <M.PasswordsDoNotMatch />

export const validCurrentPassword = (
  value,
  allValues,
  { currentWalletPassword }
) => (value === currentWalletPassword ? undefined : <M.IncorrectPassword />)

export const isNotCurrentPassword = (
  value,
  allValues,
  { currentWalletPassword }
) => (value !== currentWalletPassword ? undefined : <M.SamePasswordAsCurrent />)

export const validPasswordStretchingNumber = value =>
  value > 1 && value <= 20000 ? (
    undefined
  ) : (
    <M.InvalidPasswordStretchingNumberMessage />
  )

export const validEthAddress = ({ value: dropdownValue }) => {
  if (!dropdownValue) return
  const { value } = dropdownValue
  return utils.eth.isValidAddress(propOr(value, ['address'], value)) ? (
    undefined
  ) : (
    <M.InvalidEthAddressMessage />
  )
}

export const validXlmAddress = ({ value: dropdownValue }) => {
  if (!dropdownValue) return
  const { value } = dropdownValue
  return utils.xlm.isValidAddress(propOr(value, ['address'], value)) ? (
    undefined
  ) : (
    <M.InvalidXlmAddressMessage />
  )
}

export const validBtcAddress = (value, allValues, props) => {
  let address = value
  if (isObject(value)) {
    const { value: dropdownValue } = value
    const { value: option } = dropdownValue
    if (prop('xpub', option)) return
    if (prop('address', option)) return
    if (prop('value', dropdownValue)) address = prop('value', dropdownValue)
  }

  return utils.btc.isValidBtcAddress(address, props.network) ? (
    undefined
  ) : (
    <M.InvalidBtcAddressMessage />
  )
}

export const validBchAddress = (value, allValues, props) => {
  let address = value
  if (isObject(value)) {
    const { value: dropdownValue } = value
    const { value: option } = dropdownValue
    if (prop('xpub', option)) return
    if (prop('address', option)) return
    if (prop('value', dropdownValue)) address = prop('value', dropdownValue)
  }
  return utils.btc.isValidBtcAddress(address, props.network) ||
    utils.bch.isCashAddr(address) ? (
    undefined
  ) : (
    <M.InvalidBchAddressMessage />
  )
}

export const validEmailCode = value =>
  isAlphaNumeric(value) ? undefined : <M.InvalidEmailCodeMessage />

export const validBtcPrivateKey = (value, allValues, props) =>
  utils.btc.isValidBtcPrivateKey(value, props.network) ? (
    undefined
  ) : (
    <M.InvalidBtcPrivateKeyMessage />
  )

export const validBtcAddressOrPrivateKey = (value, allValues, props) =>
  utils.btc.isValidBtcPrivateKey(value, props.network) ||
  utils.btc.isValidBtcAddress(value, props.network) ? (
    undefined
  ) : (
    <M.InvalidBtcAddressAndPrivateKeyMessage />
  )

export const validIban = value =>
  isValidIBAN(value) ? undefined : 'Invalid IBAN'

export const validBIC = value => (isValidBIC(value) ? undefined : 'Invalid BIC')

export const ageOverEighteen = value =>
  isOverEighteen(value) ? undefined : <M.AgeOverEighteenMessage />

export const requiredSSN = value =>
  isSSN(value) ? undefined : <M.RequiredSSNMessage />

export const requiredDOB = value =>
  isDOB(value) ? undefined : <M.RequiredDOBMessage />

export const requiredUsZipcode = value =>
  isUsZipcode(value) ? undefined : <M.RequiredUSZipCodeMessage />

export const countryUsesPostalcode = countryCode => {
  return path([countryCode, 'postalCodeFormat'], postalCodes)
}

export const countryUsesZipcode = countryCode => countryCode === 'US'

export const requiredZipCode = (value, allVals) => {
  const countryCode = path(['country', 'code'], allVals)
  // If country does not have a postal code format it's not required
  if (!path([countryCode, 'postalCodeFormat'], postalCodes)) return undefined
  if (!value) return <M.RequiredMessage />

  return validate(countryCode, value) === true ? (
    undefined
  ) : (
    <M.InvalidZipCodeMessage />
  )
}

export const onPartnerCountryWhitelist = (
  value,
  allValues,
  props,
  name,
  countries
) => {
  const country = value && takeWhile(x => x !== '-', value)
  const options = path(['options', 'platforms', 'web'], props)
  const sfoxCountries = path(['sfox', 'countries'], options)
  const coinifyCountries = path(['coinify', 'countries'], options)
  const allCountries = countries || concat(sfoxCountries, coinifyCountries)
  return country && allCountries.includes(country) ? (
    undefined
  ) : (
    <M.PartnerCountryWhitelist />
  )
}

export const onPartnerStateWhitelist = (value, allValues, props) => {
  const usState = prop('code', value)
  const options = path(['options', 'platforms', 'web'], props)
  const sfoxStates = path(['sfox', 'states'], options)
  return usState && sfoxStates.includes(usState) ? (
    undefined
  ) : (
    <M.PartnerStateWhitelist />
  )
}

export const requireUniqueDeviceName = (value, usedDeviceNames) => {
  return any(equals(value))(usedDeviceNames) ? (
    <M.UniqueDeviceName />
  ) : (
    undefined
  )
}
