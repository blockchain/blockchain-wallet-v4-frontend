import bip39 from 'bip39'
import * as FormHelper from './index.js'
// import { isNumeric, isEmail, isDOB, isGuid, isUsZipcode, isIpList, isAlphaNumeric, formatSSN, formatDOB, formatUSZipcode, isOverEighteen, isSSN, isOnSfoxWhitelist, isOnPartnerCountryWhitelist } from './../ValidationHelper'

describe('FormHelper', () => {
  beforeEach(() => {
    jest.mock('blockchain-wallet-v4')
    jest.mock('./../ValidationHelper')
  })

  afterEach(() => {
    jest.unmock('blockchain-wallet-v4')
    jest.unmock('./../ValidationHelper')
  })

  describe('required()', () => {
    it('returns correct string if no value passed', () => {
      expect(FormHelper.required(null)).toEqual('Required')
    })

    it('returns undefined if value passed', () => {
      expect(FormHelper.required('test')).toBeUndefined()
    })
  })

  describe('validNumber()', () => {
    it('returns correct string if no value passed', () => {
      expect(FormHelper.validNumber('noNum')).toEqual('Invalid number')
    })

    it('returns undefined if number is passed', () => {
      expect(FormHelper.validNumber(42)).toBeUndefined()
    })
  })

  describe('requiredNumber()', () => {
    it('returns correct string if no value passed', () => {
      expect(FormHelper.requiredNumber(-3)).toEqual('Invalid number')
    })

    it('returns undefined if number is greater than zero', () => {
      expect(FormHelper.requiredNumber(42)).toBeUndefined()
    })
  })

  describe('validEmail()', () => {
    it('returns correct string if invalid email passed', () => {
      expect(FormHelper.validEmail('invalid')).toEqual('Invalid email address')
    })

    it('returns undefined if number is greater than zero', () => {
      expect(FormHelper.validEmail('test@test.com')).toBeUndefined()
    })
  })

  describe('validateMnemonic()', () => {
    it('returns correct string if invalid mnemonic passed', () => {
      expect(FormHelper.validMnemonic('zz')).toEqual('Invalid passphrase')
    })

    it('returns undefined if valid mnemonic given', () => {
      expect(FormHelper.validMnemonic(bip39.generateMnemonic())).toBeUndefined()
    })
  })

  describe('validWalletId()', () => {
    it('returns correct string if invalid walletId passed', () => {
      expect(FormHelper.validWalletId('zz')).toEqual('Invalid wallet identifier')
    })

    it('returns undefined if valid walletId is given', () => {
      expect(FormHelper.validWalletId('7e7db3ea-cd5f-4322-9728-39d9ecef1ee8')).toBeUndefined()
    })
  })

  describe('validMobileNumber()', () => {
    it('returns correct string if invalid phone number passed', () => {
      expect(FormHelper.validMobileNumber(123)).toEqual('Invalid mobile number')
    })

    it('returns undefined if valid phone number is given', () => {
      expect(FormHelper.validMobileNumber('+1-213-373-4253')).toBeUndefined()
    })
  })

  describe('validStrongPassword()', () => {
    it('returns correct string if invalid password passed', () => {
      expect(FormHelper.validStrongPassword('password')).toEqual('Your password is not strong enough')
    })

    it('returns undefined if valid password is given', () => {
      expect(FormHelper.validStrongPassword('sk8_d13_H3lp_Me')).toBeUndefined()
    })
  })

  describe('validIpList()', () => {
    it('returns correct string if invalid IP passed', () => {
      expect(FormHelper.validIpList('10.208.124')).toEqual('Invalid IP list')
    })
  })

  describe('validPasswordStretchingNumber()', () => {
    it('returns correct string if invalid password stretcher passed', () => {
      expect(FormHelper.validPasswordStretchingNumber(399999999)).toEqual('Please ensure 1 < PBKDF2 <= 20000')
    })

    it('returns undefined if valid password stretcher is given', () => {
      expect(FormHelper.validPasswordStretchingNumber(421)).toBeUndefined()
    })
  })

  describe('validEtherAddress()', () => {
    it('returns correct string if invalid ether addr passed', () => {
      expect(FormHelper.validEtherAddress('notanaddress')).toEqual('Invalid Ether Address')
    })

    it('returns undefined if valid ether addr is given', () => {
      expect(FormHelper.validEtherAddress('0x1d409aC5ca371B436C0DF3979F832745671044a5')).toBeUndefined()
    })
  })

  describe('validBitcoinAddress()', () => {
    it('returns undefined if valid bitcoin addr is given', () => {
      expect(FormHelper.validBitcoinAddress('1cKtTucHyhVrg8zRzMg7KJrvsYbxeX2eP')).toBeUndefined()
    })
  })

  describe('validEmailCode()', () => {
    it('returns correct string if invalid email code passed', () => {
      expect(FormHelper.validEmailCode('123')).toEqual('Invalid Email Code')
    })

    it('returns undefined if valid email code is given', () => {
      expect(FormHelper.validEmailCode('12E3R')).toBeUndefined()
    })
  })

  describe('validBitcoinPrivateKey()', () => {
    it('returns correct string if invalid btc private key passed', () => {
      expect(FormHelper.validBitcoinPrivateKey('NOTVALIDL1fLj9zU3Fp5vbCN88ZQYXJ3Jn3L1fLj9zU3Fp')).toEqual('Invalid Bitcoin Private Key')
    })

    it('returns undefined if valid btc private key is given', () => {
      expect(FormHelper.validBitcoinPrivateKey('L1fLj9zU3Fp5vbCN88ZQYXJ3Jn3V2XYEWBK3RuG1HEmRZDAYxYZi')).toBeUndefined()
    })
  })
})
