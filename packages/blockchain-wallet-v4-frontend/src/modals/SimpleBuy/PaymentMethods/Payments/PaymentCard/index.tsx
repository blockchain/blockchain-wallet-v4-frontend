import {
  Content,
  DisplayContainer,
  DisplayIcon,
  DisplayTitle
} from 'components/SimpleBuy'
import { fiatToString } from 'core/exchange/currency'
import { FiatType, SBPaymentMethodType } from 'core/types'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'blockchain-info-components'
import { SuccessCartridge } from 'components/Cartridge'
import { Title } from 'components/Flyout'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

const SubTitle = styled(Title)`
  color: ${props => props.theme.grey600};
  margin-top: 5px;
  line-height: 21px;
`
const DisplayIconPayment = styled(DisplayIcon)`
  min-height: 110px;
`
const CartridgeContainer = styled.div`
  width: auto;
  margin-top: 8px;
`

type Props = {
  icon: ReactElement
  onClick: (string) => void
  text: string
  value: SBPaymentMethodType
}

const PaymentCard: React.FC<Props> = ({ value, onClick, icon, text }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}PaymentCard`}
    role='button'
    onClick={onClick}
  >
    <DisplayIconPayment>{icon}</DisplayIconPayment>
    <Content>
      <DisplayTitle>{text}</DisplayTitle>
      <SubTitle>
        <FormattedMessage
          id='modals.simplebuy.card_limit'
          defaultMessage='{card} Limit'
          values={{
            card: `${fiatToString({
              value: value.limits.max,
              unit: String(value.currency) as FiatType
            })} ${value.currency}`
          }}
        />
      </SubTitle>
      <SubTitle>
        <FormattedMessage
          id='modals.simplebuy.instantly_buy'
          defaultMessage='Instantly buy crypto with any Visa or Mastercard.'
        />
      </SubTitle>
      <CartridgeContainer>
        <SuccessCartridge>
          <FormattedMessage
            id='modals.simplebuy.most_popular'
            defaultMessage='Most Popular'
          />
        </SuccessCartridge>
      </CartridgeContainer>
    </Content>
    <Icon name='chevron-right' size='24px' color='grey400' />
  </DisplayContainer>
)

export default PaymentCard
