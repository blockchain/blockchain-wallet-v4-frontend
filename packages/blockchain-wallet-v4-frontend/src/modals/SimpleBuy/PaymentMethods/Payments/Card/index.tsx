import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  DisplayContainer,
  DisplayIcon,
  DisplayTitle
} from 'components/SimpleBuy'
import { fiatToString } from 'core/exchange/currency'
import { FiatType, SBPaymentMethodType } from 'core/types'
import { FormattedMessage } from 'react-intl'
import { Title, Value } from 'components/Flyout'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const Display = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 230px;
  color: ${props => props.theme.grey800};
  margin-left: 16px;
`

const DisplaySubTitle = styled(Title)`
  align-items: left;
  font-weight: 500;
  font-size: 14px;
  color: ${props => props.theme.grey600};
  width: 100%;
`
const MainValue = styled(Value)`
  margin-top: 0;
  text-align: right;
  font-size: 16px;
  color: ${props => props.theme.grey900};
`
const SubValue = styled(Value)`
  margin-top: 0;
  font-weight: 500;
  color: ${props => props.theme.grey600};
  text-align: right;
  font-size: 14px;
`

const DisplayCardDetails = styled.div`
  width: 130px;
  text-align: right;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  text: string
  value: SBPaymentMethodType
}

const Card: React.FC<Props> = ({ value, onClick, icon, text }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}Cards`}
    role='button'
    onClick={onClick}
  >
    <DisplayIcon>{icon}</DisplayIcon>
    <Display>
      <DisplayTitle>{text}</DisplayTitle>
      <DisplaySubTitle>
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
      </DisplaySubTitle>
    </Display>
    {value.card && (
      <DisplayCardDetails>
        <MainValue>{value.card.number}</MainValue>
        <SubValue>
          <FormattedMessage
            id='modals.simplebuy.card_expire'
            defaultMessage='Exp: {month}/{year}'
            values={{
              month: value.card.expireMonth,
              year: value.card.expireYear
            }}
          />
        </SubValue>
      </DisplayCardDetails>
    )}
  </DisplayContainer>
)

export default Card
