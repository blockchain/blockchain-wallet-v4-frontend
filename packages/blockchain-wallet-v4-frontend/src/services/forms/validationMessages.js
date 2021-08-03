import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Link } from 'blockchain-info-components'

export const AgeOverEighteenMessage = () => (
  <FormattedMessage id='formhelper.ageovereighteen' defaultMessage='Must be 18 or older' />
)
export const InvalidBtcAddressMessage = () => (
  <div data-e2e='invalidBtcAddress'>
    <FormattedMessage id='formhelper.invalidbtcaddress' defaultMessage='Invalid Bitcoin address' />
  </div>
)
export const InvalidBchAddressMessage = () => (
  <div data-e2e='invalidBchAddress'>
    <FormattedMessage
      id='formhelper.invalidbchaddress'
      defaultMessage='Invalid Bitcoin Cash address'
    />
  </div>
)
export const InvalidBtcPrivateKeyMessage = () => (
  <FormattedMessage
    id='formhelper.invalidbitcoinprivatekey'
    defaultMessage='Invalid Bitcoin Private Key'
  />
)
export const InvalidBtcAddressAndPrivateKeyMessage = () => (
  <FormattedMessage
    id='formhelper.invalidbitcoinaddressandkey'
    defaultMessage='Not a valid bitcoin address or private key'
  />
)
export const SegwitAddressMessage = () => (
  <FormattedMessage
    id='formhelper.segwitaddress'
    defaultMessage='Segwit addresses are not supported'
  />
)
export const InvalidEmailCodeMessage = () => (
  <FormattedMessage id='formhelper.invalidemailcode' defaultMessage='Invalid Email Code' />
)
export const InvalidEmailMessage = () => (
  <FormattedMessage id='formhelper.invalidemail' defaultMessage='Invalid email address' />
)
export const ValidEmailNotAllowed = () => 'valid_email_not_allowed'
export const InvalidEthAddressMessage = () => (
  <div data-e2e='invalidEthAddress'>
    <FormattedMessage
      id='formhelper.invalid_ethereum_address'
      defaultMessage='Invalid Ethereum address'
    />
  </div>
)
export const InvalidXlmAddressMessage = () => (
  <div data-e2e='invalidXlmAddress'>
    <FormattedMessage id='formhelper.invalidxlmaddress' defaultMessage='Invalid Stellar address' />
  </div>
)
export const InvalidIpListMessage = () => (
  <FormattedMessage id='formhelper.invalidiplist' defaultMessage='Invalid IP list' />
)
export const InvalidMobileNumberMessage = () => (
  <FormattedMessage id='formhelper.invalidmobilenumber' defaultMessage='Invalid mobile number' />
)
export const InvalidNumberMessage = () => (
  <FormattedMessage id='formhelper.invalidnumber' defaultMessage='Invalid number' />
)
export const InvalidPassphraseMessage = () => (
  <FormattedMessage id='formhelper.invalidphrase' defaultMessage='Invalid phrase' />
)
export const InvalidPasswordStretchingNumberMessage = () => (
  <FormattedMessage
    id='formhelper.invalidpasswordstretchingnumber'
    defaultMessage='PBKDF2 must be between 1 and 20000'
  />
)
export const InvalidWalletIdMessage = () => (
  <FormattedMessage id='formhelper.invalidwalletid' defaultMessage='Invalid Wallet ID' />
)

export const InvalidWalletIdorEmailMessage = () => (
  <FormattedMessage
    id='formhelper.invalidwalletidemail'
    defaultMessage='Invalid Wallet ID or Email'
  />
)

export const PartnerCountryWhitelist = () => (
  <FormattedMessage
    id='formhelper.partnercountrywhitelist'
    defaultMessage='Country not available for buy & sell'
  />
)
export const PartnerStateWhitelist = () => (
  <FormattedMessage
    id='formhelper.partnerstatewhitelist'
    defaultMessage='State not available for buy & sell'
  />
)
export const InvalidStrongPassword = () => (
  <FormattedMessage
    id='scenes.register.invalidstrongpassword'
    defaultMessage='Your password is not strong enough'
  />
)
export const PasswordsDoNotMatch = () => (
  <FormattedMessage id='formhelper.passwordsdonotmatch' defaultMessage='Passwords do not match' />
)
export const ExchangeRequires2FAMessage = () => (
  <>
    <FormattedMessage
      id='formhelper.exchange.require2fa'
      defaultMessage='Exchange deposits require 2FA.'
    />
    <Link
      href='https://exchange.blockchain.com/trade/login'
      target='_blank'
      rel='noopener noreferrer'
      size='12px'
    >
      {' '}
      <FormattedMessage id='formhelper.exchange.learnmore' defaultMessage='Learn more.' />
    </Link>
  </>
)
export const IncorrectPassword = () => (
  <FormattedMessage id='formhelper.incorrectpassword' defaultMessage='Incorrect password' />
)
export const SamePasswordAsCurrent = () => (
  <FormattedMessage
    id='formhelper.samepasswordascurrent'
    defaultMessage='Password is the same as current'
  />
)
export const RequiredDOBMessage = () => (
  <FormattedMessage id='formhelper.requireddob' defaultMessage='Must be a valid date' />
)
export const RequiredMessage = () => (
  <div data-e2e='requiredMessage'>
    <FormattedMessage id='formhelper.required' defaultMessage='Required' />
  </div>
)
export const RequiredNumberMessage = () => (
  <FormattedMessage id='formhelper.requirednumber' defaultMessage='Invalid number' />
)
export const RequiredSSNMessage = () => (
  <FormattedMessage id='formhelper.requiredssn' defaultMessage='Must be valid SSN' />
)
export const RequiredUSZipCodeMessage = () => (
  <FormattedMessage id='formhelper.requireduszipcode' defaultMessage='Must be a valid US Zipcode' />
)

export const InvalidZipCodeMessage = () => (
  <FormattedMessage id='formhelper.requiredzipcode' defaultMessage='Invalid zipcode' />
)

export const UnacceptedTermsMessage = () => (
  <FormattedMessage
    id='formhelper.unacceptedterms'
    defaultMessage='You must agree to the terms and conditions'
  />
)

export const UniqueDeviceName = () => (
  <FormattedMessage
    id='formhelper.uniquedevicename'
    defaultMessage='Device name is already in use.'
  />
)

export const UniqueWalletName = () => (
  <FormattedMessage
    id='formhelper.uniquewalletname'
    defaultMessage='Wallet name is already taken.'
  />
)

export const ValueOverMaxMessage = () => (
  <FormattedMessage id='formhelper.valueovermax' defaultMessage='Value is over the max' />
)

export const ValueIsEqualToMaxMessage = () => (
  <FormattedMessage
    id='formhelper.valueisequaltomax'
    defaultMessage='Value must not be equal to the max'
  />
)
