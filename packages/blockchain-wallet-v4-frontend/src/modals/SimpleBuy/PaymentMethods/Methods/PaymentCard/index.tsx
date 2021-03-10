import React, { ReactElement } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Image } from 'blockchain-info-components'
import { SBPaymentMethodType } from 'blockchain-wallet-v4/src/types'
import { SuccessCartridge } from 'components/Cartridge'
import {
  Content,
  Description,
  DisplayContainer,
  DisplayIcon,
  DisplaySubTitle,
  DisplayTitle
} from 'components/SimpleBuy'
import { media } from 'services/styles'

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
  text: ReactElement | string
  value: SBPaymentMethodType
}

const PaymentCard: React.FC<Props> = ({ icon, onClick, text, value }) => (
  <DisplayContainer
    data-e2e={`sb${value.type.toLowerCase()}PaymentCard`}
    role='button'
    onClick={onClick}
  >
    <DisplayIconPayment>{icon}</DisplayIconPayment>
    <Content>
      <DisplayTitle>{text}</DisplayTitle>
      <DisplaySubTitle>
        <FormattedMessage
          id='copy.instantly_available'
          defaultMessage='Instantly Available'
        />
      </DisplaySubTitle>
      <Description>
        <FormattedMessage
          id='modals.simplebuy.instantly_buy'
          defaultMessage='Instantly buy crypto with any Visa or Mastercard.'
        />
      </Description>
      <CartridgeContainer>
        <SuccessCartridge>
          <FormattedMessage
            id='copy.most_popular'
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
