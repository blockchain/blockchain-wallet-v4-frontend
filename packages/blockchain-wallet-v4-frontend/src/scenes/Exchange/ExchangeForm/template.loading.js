import React from 'react'
import { currencySymbolMap } from 'services/CoinifyService'
import { Remote } from 'blockchain-wallet-v4'
import { model } from 'data'
import Success from './template.success'

const { BASE_IN_FIAT } = model.rates.FIX_TYPES

const stubBtcAccount = {
  archived: false,
  coin: 'BTC',
  label: 'Bitcon',
  address: 0,
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
  canUseExchange: false,
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
  sourceToTargetRate: Remote.of(0),
  sourceToFiatRate: Remote.of(0),
  targetToFiatRate: Remote.of(0),
  sourceCoin: 'BTC',
  targetCoin: 'ETH',
  sourceActive: true,
  targetActive: false,
  coinActive: false,
  fiatActive: true,
  fix: BASE_IN_FIAT
}

export default () => <Success {...stubProps} />
