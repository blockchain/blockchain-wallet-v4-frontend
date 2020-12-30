import { FormattedMessage } from 'react-intl'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  DisplayContainer,
  DisplayIcon,
  MultiRowContainer
} from 'components/SimpleBuy'
import { fiatToString } from 'core/exchange/currency'
import { FiatType, SBPaymentMethodType } from 'core/types'
import { Title, Value } from 'components/Flyout'

const DisplayCardDetails = styled.div`
  text-align: right;
  white-space: nowrap;
`

type Props = {
  icon: ReactElement
  onClick: () => void
  text: string
  value: SBPaymentMethodType
}

const Bank: React.FC<Props> = ({ icon, text, value, onClick }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}Cards`}
    role='button'
    onClick={onClick}
  >
    <DisplayIcon>{icon}</DisplayIcon>
    <MultiRowContainer>
      <Value asTitle>{text}</Value>
      <Title asValue>
        <FormattedMessage
          id='modals.simplebuy.card_limit'
          defaultMessage='{card} Limit'
          values={{
            card: `${fiatToString({
              value: convertBaseToStandard('FIAT', value.limits.max),
              unit: String(value.currency) as FiatType
            })} ${value.currency}`
          }}
        />
      </Title>
    </MultiRowContainer>
    {value.card && (
      <DisplayCardDetails>
        <Value asTitle>····{value.card.number}</Value>
        <Title asValue>
          <FormattedMessage
            id='modals.simplebuy.card_expire'
            defaultMessage='Exp: {month}/{year}'
            values={{
              month: value.card.expireMonth,
              year: value.card.expireYear
            }}
          />
        </Title>
      </DisplayCardDetails>
    )}
  </DisplayContainer>
)

export default Bank
