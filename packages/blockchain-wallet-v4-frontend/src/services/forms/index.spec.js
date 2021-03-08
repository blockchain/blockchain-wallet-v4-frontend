import React from 'react'
import bip39 from 'bip39'
import { networks } from 'bitcoinjs-lib'

import * as FormHelper from './index.js'
import * as M from './validationMessages'

describe('FormHelper', () => {
  beforeEach(() => {
    jest.mock('blockchain-wallet-v4/src')
    jest.mock('./utils')
  })

  afterEach(() => {
    jest.unmock('blockchain-wallet-v4/src')
    jest.unmock('./utils')
  })

  describe('required()', () => {
    it('returns correct string if no value passed', () => {
      expect(FormHelper.required(null)).toEqual(<M.RequiredMessage />)
    })

    it('returns undefined if value passed', () => {
      expect(FormHelper.required('test')).toBeUndefined()
    })
  })

  describe('optional()', () => {
    it('returns falsy value', () => {
      expect(
        FormHelper.optional(FormHelper.validNumber('Not num'))()
      ).toBeFalsy()
    })
  })

  describe('validNumber()', () => {
    it('returns correct string if no valid number is passed', () => {
      expect(FormHelper.validNumber('noNum')).toEqual(
        <M.InvalidNumberMessage />
      )
    })

    it('returns undefined if number is passed', () => {
      expect(FormHelper.validNumber(42)).toBeUndefined()
    })
  })

  describe('requiredNumber()', () => {
    it('returns correct string if no value passed', () => {
      expect(FormHelper.requiredNumber(-3)).toEqual(<M.RequiredNumberMessage />)
    })

    it('returns undefined if number is greater than zero', () => {
      expect(FormHelper.requiredNumber(42)).toBeUndefined()
    })
  })

  describe('validEmail()', () => {
    it('returns correct string if invalid email passed', () => {
      expect(FormHelper.validEmail('invalid')).toEqual(
        <M.InvalidEmailMessage />
      )
    })

    it('returns undefined if number is greater than zero', () => {
      expect(FormHelper.validEmail('test@test.com')).toBeUndefined()
    })
  })

  describe('validateMnemonic()', () => {
    it('returns correct string if invalid mnemonic passed', () => {
      expect(FormHelper.validMnemonic('zz')).toEqual(
        <M.InvalidPassphraseMessage />
      )
    })

    it('returns undefined if valid mnemonic given', () => {
      expect(FormHelper.validMnemonic(bip39.generateMnemonic())).toBeUndefined()
    })
  })

  describe('validWalletId()', () => {
    it('returns correct string if invalid walletId passed', () => {
      expect(FormHelper.validWalletId('zz')).toEqual(
        <M.InvalidWalletIdMessage />
      )
    })

    it('returns undefined if valid walletId is given', () => {
      expect(
        FormHelper.validWalletId('7e7db3ea-cd5f-4322-9728-39d9ecef1ee8')
      ).toBeUndefined()
    })
  })

  describe('validMobileNumber()', () => {
    it('returns correct string if invalid phone number passed', () => {
      expect(FormHelper.validMobileNumber(123)).toEqual(
        <M.InvalidMobileNumberMessage />
      )
    })

    it('returns undefined if valid phone number is given', () => {
      expect(FormHelper.validMobileNumber('+1-213-373-4253')).toBeUndefined()
    })
  })

  describe('validIpList()', () => {
    it('returns correct string if invalid IP passed', () => {
      expect(FormHelper.validIpList('10.208.124')).toEqual(
        <M.InvalidIpListMessage />
      )
    })
  })

  describe('validPasswordStretchingNumber()', () => {
    it('returns correct string if invalid password stretcher passed', () => {
      expect(FormHelper.validPasswordStretchingNumber(399999999)).toEqual(
        <M.InvalidPasswordStretchingNumberMessage />
      )
    })

    it('returns undefined if valid password stretcher is given', () => {
      expect(FormHelper.validPasswordStretchingNumber(421)).toBeUndefined()
    })
  })

  describe('validEthAddress()', () => {
    it('returns correct string if invalid ether addr passed', () => {
      expect(
        FormHelper.validEthAddress({ value: { value: 'notanaddress' } })
      ).toEqual(<M.InvalidEthAddressMessage />)
    })

    it('returns undefined if valid ether addr is given', () => {
      expect(
        FormHelper.validEthAddress({
          value: { value: '0x1d409aC5ca371B436C0DF3979F832745671044a5' }
        })
      ).toBeUndefined()
    })
  })

  describe('validBtcAddress()', () => {
    it('returns undefined if valid bitcoin addr is given', () => {
      expect(
        FormHelper.validBtcAddress('1cKtTucHyhVrg8zRzMg7KJrvsYbxeX2eP', null, {
          network: networks.bitcoin
        })
      ).toBeUndefined()
    })
  })

  describe('validEmailCode()', () => {
    it('returns correct string if invalid email code passed', () => {
      expect(FormHelper.validEmailCode('123')).toEqual(
        <M.InvalidEmailCodeMessage />
      )
    })

    it('returns undefined if valid email code is given', () => {
      expect(FormHelper.validEmailCode('12E3R')).toBeUndefined()
    })
  })

  describe('validBtcPrivateKey()', () => {
    it('returns correct string if invalid btc private key passed', () => {
      expect(
        FormHelper.validBtcPrivateKey(
          'NOTVALIDL1fLj9zU3Fp5vbCN88ZQYXJ3Jn3L1fLj9zU3Fp',
          null,
          {
            network: networks.bitcoin
          }
        )
      ).toEqual(<M.InvalidBtcPrivateKeyMessage />)
    })

    it('returns undefined if valid btc private key is given', () => {
      expect(
        FormHelper.validBtcPrivateKey(
          'L1fLj9zU3Fp5vbCN88ZQYXJ3Jn3V2XYEWBK3RuG1HEmRZDAYxYZi',
          null,
          {
            network: networks.bitcoin
          }
        )
      ).toBeUndefined()
    })
  })

  describe('validBchAddress()', () => {
    it('returns correct string if invalid bth addr passed', () => {
      expect(
        FormHelper.validBchAddress(
          'NOTVALIDqqrrt6920wp5zndraya69eltes4tzswn2svhxgqh5a',
          null,
          { network: networks.bitcoin }
        )
      ).toEqual(<M.InvalidBchAddressMessage />)
    })

    it('returns undefined if valid bch addr is given', () => {
      expect(
        FormHelper.validBchAddress(
          'qqrrt6920wp5zndraya69eltes4tzswn2svhxgqh5a',
          null,
          { network: networks.bitcoin }
        )
      ).toBeUndefined()
    })
  })

  describe('validIban()', () => {
    it('returns correct string if invalid iban passed', () => {
      expect(FormHelper.validIban('this is not a valid iban')).toEqual(
        'Invalid IBAN'
      )
    })

    it('returns undefined if valid iban is given', () => {
      expect(FormHelper.validIban('GB04BARC20474473160944')).toBeUndefined()
    })
  })

  describe('validBIC()', () => {
    it('returns correct string if invalid BIC passed', () => {
      expect(FormHelper.validBIC('this is not a valid BIC')).toEqual(
        'Invalid BIC'
      )
    })

    it('returns undefined if valid BIC is given', () => {
      expect(FormHelper.validBIC('DABAIE2D')).toBeUndefined()
    })
  })

  describe('ageOverEighteen()', () => {
    it('returns correct string if age is not over 18', () => {
      expect(FormHelper.ageOverEighteen(Date.now() - 400000)).toEqual(
        <M.AgeOverEighteenMessage />
      )
    })

    it('returns undefined if age is over 18', () => {
      expect(FormHelper.ageOverEighteen(2100134239)).toBeUndefined()
    })
  })

  describe('requiredSSN()', () => {
    it('returns correct string if not a valid SSN', () => {
      expect(FormHelper.requiredSSN('123-1243-12412')).toEqual(
        <M.RequiredSSNMessage />
      )
    })

    it('returns undefined if SSN is valid', () => {
      expect(FormHelper.requiredSSN('111-22-3333')).toBeUndefined()
    })
  })

  describe('requiredDOB()', () => {
    it('returns correct string if DOB is not valid', () => {
      expect(FormHelper.requiredDOB('sfa')).toEqual(<M.RequiredDOBMessage />)
    })

    it('returns undefined if DOB is valid', () => {
      expect(FormHelper.requiredDOB('11-11-1911')).toBeUndefined()
    })
  })

  describe('requiredUsZipcode()', () => {
    it('returns correct string if DOB is not valid', () => {
      expect(FormHelper.requiredUsZipcode('78342223')).toEqual(
        <M.RequiredUSZipCodeMessage />
      )
    })

    it('returns undefined if zip is valid', () => {
      expect(FormHelper.requiredUsZipcode('11322')).toBeUndefined()
    })
  })

  describe('requireUniqueDeviceName()', () => {
    it('returns true if device name is not unique', () => {
      expect(FormHelper.requireUniqueDeviceName('device', ['device'])).toEqual(
        <M.UniqueDeviceName />
      )
    })

    it('returns undefined if device name is unqiue', () => {
      expect(
        FormHelper.requireUniqueDeviceName('uniqueDevice', ['device'])
      ).toBeUndefined()
    })
  })

  it('removeWhitespace()', () => {
    expect(FormHelper.removeWhitespace('block chain')).toEqual('blockchain')
  })

  it('normalizeSocialSecurity() returns normalized SSN', () => {
    expect(FormHelper.normalizeSocialSecurity('111223333')).toEqual(
      '111-22-3333'
    )
  })

  it('normalizeDateOfBirth() returns normalized dob', () => {
    expect(FormHelper.normalizeDateOfBirth('11301988')).toEqual('11/30/1988')
  })

  it('normalizeUSZipcode() returns normalized zip code', () => {
    expect(FormHelper.normalizeUSZipcode('11207000')).toEqual('11207')
  })
})
