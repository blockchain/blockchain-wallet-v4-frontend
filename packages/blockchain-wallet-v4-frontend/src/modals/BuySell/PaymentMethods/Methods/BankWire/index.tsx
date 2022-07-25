import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { BSPaymentMethodType } from '@core/types'
import { Icon } from 'blockchain-info-components'
import {
  Content,
  Description,
  DisplayContainer,
  DisplayIcon,
  DisplaySubTitle,
  DisplayTitle
} from 'components/BuySell'

import { getDescriptionFromCurrency, getSubTitleByCurrency } from './utils'

const DisplayTitleBank = styled(DisplayTitle)`
  margin-bottom: 2px;
`
const DisplayIconBank = styled(DisplayIcon)`
  min-height: 75px;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  text: ReactElement | string
  value: BSPaymentMethodType
}

const BankWire: React.FC<Props> = ({ icon, onClick, text, value }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}BankWire`}
    role='button'
    onClick={onClick}
  >
    <DisplayIconBank>{icon}</DisplayIconBank>
    <Content>
      <DisplayTitleBank>{text}</DisplayTitleBank>
      <DisplaySubTitle>{getSubTitleByCurrency(value.currency)}</DisplaySubTitle>
      <Description>{getDescriptionFromCurrency(value.currency)}</Description>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default BankWire
