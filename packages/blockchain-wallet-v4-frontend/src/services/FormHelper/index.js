import { isEmpty } from 'ramda'
import bip39 from 'bip39'
import { isNumeric, isEmail, isDOB, isGuid, isUsZipcode, isIpList, isAlphaNumeric, formatSSN, formatDOB, formatUSZipcode, isOverEighteen, isSSN, isOnSfoxWhitelist, isOnPartnerCountryWhitelist } from './../ValidationHelper'
import { parse } from 'libphonenumber-js'
import zxcvbn from 'zxcvbn'
import { utils } from 'blockchain-wallet-v4/src'

const required = value => value ? undefined : 'Required'

const optional = validator => value => value === undefined || value === '' ? undefined : validator(value)

const validNumber = value => isNumeric(value) ? undefined : 'Invalid number'

const requiredNumber = value => isNumeric(value) && value > 0 ? undefined : 'Invalid number'

const validEmail = value => isEmail(value) ? undefined : 'Invalid email address'

const validMnemonic = value => bip39.validateMnemonic(value) ? undefined : 'Invalid passphrase'

const validWalletId = value => isGuid(value) ? undefined : 'Invalid wallet identifier'

const validMobileNumber = value => !isEmpty(parse(value)) ? undefined : 'Invalid mobile number'

const validStrongPassword = value => (value !== undefined && zxcvbn(value).score > 1) ? undefined : 'Your password is not strong enough'

const validIpList = value => isIpList(value) ? undefined : 'Invalid IP list'

const validPasswordStretchingNumber = value => (value > 1 && value <= 20000) ? undefined : 'Please ensure 1 < PBKDF2 <= 20000'

const validEtherAddress = value => utils.ethereum.isValidAddress(value) ? undefined : 'Invalid Ethereum Address'

const validBitcoinAddress = value => utils.bitcoin.isValidBitcoinAddress(value) ? undefined : 'Invalid Bitcoin Address'

const validEmailCode = value => isAlphaNumeric(value) ? undefined : 'Invalid Email Code'

const validBitcoinPrivateKey = value => utils.bitcoin.isValidBitcoinPrivateKey(value) ? undefined : 'Invalid Bitcoin Private Key'

const normalizeSocialSecurity = (val, prevVal) => formatSSN(val, prevVal)

const normalizeDateOfBirth = (val, prevVal) => formatDOB(val, prevVal)

const normalizeUSZipcode = value => formatUSZipcode(value)

const ageOverEighteen = value => isOverEighteen(value) ? undefined : 'Must be 18 or older'

const requiredSSN = value => isSSN(value) ? undefined : 'Must be valid SSN'

const requiredDOB = value => isDOB(value) ? undefined : 'Must be valid date'

const requiredUsZipcode = value => isUsZipcode(value) ? undefined : 'Must be valid zipcode'

const onSfoxWhitelist = value => isOnSfoxWhitelist(value) ? undefined : 'Not available in your state.'

const onPartnerCountryWhitelist = value => isOnPartnerCountryWhitelist(value) ? undefined : 'Not available in your country.'

export {
  required,
  requiredDOB,
  onPartnerCountryWhitelist,
  onSfoxWhitelist,
  optional,
  requiredNumber,
  requiredSSN,
  requiredUsZipcode,
  validNumber,
  validEmail,
  validEmailCode,
  validMnemonic,
  validWalletId,
  validMobileNumber,
  validStrongPassword,
  validIpList,
  validPasswordStretchingNumber,
  validBitcoinAddress,
  validBitcoinPrivateKey,
  validEtherAddress,
  normalizeSocialSecurity,
  normalizeDateOfBirth,
  normalizeUSZipcode,
  ageOverEighteen
}
