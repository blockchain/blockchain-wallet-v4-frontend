import React from 'react'
import bip39 from 'bip39'
import {
  isNumeric,
  isEmail,
  isDOB,
  isGuid,
  isUsZipcode,
  isIpList,
  isAlphaNumeric,
  isOverEighteen,
  isSSN
} from 'services/ValidationHelper'

import { isValidIBAN, isValidBIC } from 'ibantools'
import { isValidNumber } from 'libphonenumber-js'
import { validate } from 'postal-codes-js'
import postalCodes from 'postal-codes-js/generated/postal-codes-alpha2'
import zxcvbn from 'zxcvbn'
import { utils } from 'blockchain-wallet-v4/src'
import * as M from './validationMessages'
import { any, concat, equals, path, takeWhile, prop } from 'ramda'

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

export const validMnemonic = value =>
  bip39.validateMnemonic(value) ? undefined : <M.InvalidPassphraseMessage />

export const validWalletId = value =>
  isGuid(value) ? undefined : <M.InvalidWalletIdMessage />

export const validMobileNumber = value =>
  isValidNumber(value) ? undefined : <M.InvalidMobileNumberMessage />

export const validStrongPassword = value =>
  value !== undefined && zxcvbn(value).score > 1 ? (
    undefined
  ) : (
    <M.InvalidStrongPasswordMessage />
  )

export const validIpList = value =>
  isIpList(value) ? undefined : <M.InvalidIpListMessage />

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

export const validEtherAddress = value =>
  utils.ethereum.isValidAddress(value) ? (
    undefined
  ) : (
    <M.InvalidEtherAddressMessage />
  )

export const validXlmAddress = value =>
  utils.xlm.isValidAddress(value) ? undefined : <M.InvalidXlmAddressMessage />

export const validBitcoinAddress = (value, allValues, props) => {
  return utils.bitcoin.isValidBitcoinAddress(value, props.network) ? (
    undefined
  ) : (
    <M.InvalidBitcoinAddressMessage />
  )
}

export const validBitcoinCashAddress = (value, allValues, props) =>
  utils.bitcoin.isValidBitcoinAddress(value, props.network) ||
  utils.bch.isCashAddr(value) ? (
    undefined
  ) : (
    <M.InvalidBitcoinCashAddressMessage />
  )

export const validEmailCode = value =>
  isAlphaNumeric(value) ? undefined : <M.InvalidEmailCodeMessage />

export const validBitcoinPrivateKey = (value, allValues, props) =>
  utils.bitcoin.isValidBitcoinPrivateKey(value, props.network) ? (
    undefined
  ) : (
    <M.InvalidBitcoinPrivateKeyMessage />
  )

export const validBitcoinAddressOrPrivateKey = (value, allValues, props) =>
  utils.bitcoin.isValidBitcoinPrivateKey(value, props.network) ||
  utils.bitcoin.isValidBitcoinAddress(value, props.network) ? (
    undefined
  ) : (
    <M.InvalidBitcoinAddressAndPrivateKeyMessage />
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
