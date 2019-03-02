import React from 'react'
import { BigNumber } from 'bignumber.js'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { prop } from 'ramda'
import { currencySymbolMap } from 'services/CoinifyService'

import { Exchange } from 'blockchain-wallet-v4/src'
import { model } from 'data'
import { Banner } from 'blockchain-info-components'
import ModalIcon from '../ModalIcon'

const { RESERVE_LEARN_MODAL } = model.components.sendXlm

const BannerTemplate = styled(Banner)`
  > div {
    width: 100%;
    align-items: center;
  }
  margin-bottom: 16px;
`

export const InfoBanner = props => {
  const effectiveBalance = prop('effectiveBalance', props)
  const reserve = prop('reserve', props)
  const fee = prop('fee', props)
  const reserveXlm = Exchange.convertXlmToXlm({
    value: reserve,
    fromUnit: 'STROOP',
    toUnit: 'XLM'
  }).value
  const currency = prop('currency', props)
  const rates = prop('rates', props)
  const effectiveBalanceFiat = Exchange.convertXlmToFiat({
    value: new BigNumber.sum(effectiveBalance, fee),
    fromUnit: 'STROOP',
    toCurrency: currency,
    rates
  }).value
  const effectiveBalanceXlm = Exchange.convertXlmToXlm({
    value: new BigNumber.sum(effectiveBalance, fee),
    fromUnit: 'STROOP',
    toUnit: 'XLM'
  }).value
  const modalProps = { currency, effectiveBalanceXlm, fee, rates, reserveXlm }

  return (
    <BannerTemplate data-e2e='sendXlmBalanceBanner'>
      <FormattedMessage
        id='modals.sendxlm.reserveinfo'
        defaultMessage='Your available balance is {currencySymbol}{effectiveBalanceFiat} (minus fee). Learn about Stellar’s minimum balance.'
        values={{
          effectiveBalanceFiat,
          currencySymbol: currencySymbolMap[currency]
        }}
      />
      <ModalIcon modal={RESERVE_LEARN_MODAL} {...modalProps} />
    </BannerTemplate>
  )
}
