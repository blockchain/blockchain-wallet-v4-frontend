import { FormattedMessage } from 'react-intl'
import { Icon, Image } from 'blockchain-info-components'
import React, { ReactElement } from 'react'
import styled from 'styled-components'

import {
  Content,
  DisplayContainer,
  DisplayIcon,
  DisplayTitle
} from 'components/SimpleBuy'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'core/exchange/currency'
import { SBPaymentMethodType } from 'core/types'
import { SuccessCartridge } from 'components/Cartridge'
import { Title } from 'components/Flyout'
import media from 'services/ResponsiveService'

const SubTitle = styled(Title)`
  color: ${props => props.theme.grey600};
  margin-top: 5px;
  line-height: 21px;
`
const DisplayIconPayment = styled(DisplayIcon)`
  min-height: 110px;
`
const CartridgeContainer = styled.div`
  display: flex;
  margin-top: 8px;
  align-items: center;
`
const CardContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 16px;
  > img {
    margin-left: 8px;
  }
`
const ChevronWrapper = styled.div`
  height: 125px;
  ${media.mobile`
    height: 132px;
  `};
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
              value: convertBaseToStandard('FIAT', value.limits.max),
              unit: value.currency
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
        <CardContainer>
          <Image name='visa-logo' />
          <Image name='mastercard-logo' />
        </CardContainer>
      </CartridgeContainer>
    </Content>
    <ChevronWrapper>
      <Icon name='chevron-right' size='24px' color='grey400' />
    </ChevronWrapper>
  </DisplayContainer>
)

export default PaymentCard
