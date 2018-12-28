import React from 'react'
import { currencySymbolMap } from 'services/CoinifyService'
import { Remote } from 'blockchain-wallet-v4'
import { model } from 'data'
import Success from './template.success'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

const { BASE_IN_FIAT } = model.rates.FIX_TYPES

const stubBtcAccount = {
  archived: false,
  coin: 'BTC',
  label: 'Bitcoin',
  address: 0,
  type: ADDRESS_TYPES.ACCOUNT,
  balance: 0
}

const stubEthAccount = {
  archived: false,
  coin: 'ETH',
  label: 'Ether',
  address: 0,
  balance: 0
}

const stubProps = {
  availablePairs: [],
  fromElements: [
    {
      group: '',
      items: [{ text: stubBtcAccount.label, value: stubBtcAccount }]
    }
  ],
  toElements: [
    {
      group: '',
      items: [{ text: stubEthAccount.label, value: stubEthAccount }]
    }
  ],
  initialValues: {
    source: stubBtcAccount,
    target: stubEthAccount,
    sourceFiat: 0,
    fix: BASE_IN_FIAT
  },
  hasOneAccount: true,
  disabled: false,
  formError: '',
  currency: 'USD',
  inputField: 'sourceFiat',
  inputSymbol: currencySymbolMap.USD,
  complementaryAmount: Remote.of(0),
  complementarySymbol: currencySymbolMap.BTC,
  sourceAmount: Remote.of(0),
  targetAmount: Remote.of(0),
  targetFiat: Remote.of(0),
  sourceToTargetRate: Remote.Loading,
  sourceToFiatRate: Remote.Loading,
  targetToFiatRate: Remote.Loading,
  sourceCoin: 'BTC',
  targetCoin: 'ETH',
  sourceActive: true,
  targetActive: false,
  coinActive: false,
  fiatActive: true,
  fix: BASE_IN_FIAT,
  min: null,
  max: null,
  targetFee: Remote.NotAsked,
  sourceFee: {
    source: 0,
    target: 0
  }
}

export default () => <Success {...stubProps} />
