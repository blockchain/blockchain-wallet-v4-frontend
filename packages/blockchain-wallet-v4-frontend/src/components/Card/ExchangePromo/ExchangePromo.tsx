import React from 'react'
import { FormattedMessage } from 'react-intl'
import { IconCloseCircle as _CloseIcon, SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button as _Button, Icon } from 'blockchain-info-components'
import chart from 'blockchain-info-components/src/Images/img/exchange-chart.png'
import { Card } from 'components/Card'

const PromoCard = styled(Card)`
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 99;
  min-height: 176px;
  width: 323px;
  border-radius: 20px;
  color: white;
  padding: 1.25rem;
  background: url(${chart}) black;
  background-repeat: no-repeat;
  background-position-x: center;
`

const Body = styled.div`
  margin: 1rem 0;
`

const Title = styled.h2`
  font-weight: 600;
  font-size: 20px;
  line-height: 150%;
  margin: 0;
`

const Description = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 150%;
  margin: 0;
`

const Button = styled(_Button)`
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  height: 48px;
  padding: 8px 14px;
  color: black;
  width: 100%;
`

const IconWrapper = styled.div`
  background: white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CloseIcon = styled(_CloseIcon)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  opacity: 0.5;
`

type Props = {
  onClick: () => void
  onClose: () => void
}

const ExchangePromo = ({ onClick, onClose }: Props) => (
  <PromoCard>
    <IconWrapper>
      <Icon name='blockchain-logo' color='black' size='20px' />
    </IconWrapper>
    <Body>
      <Title>
        <FormattedMessage id='copy.exchange_promo.title' defaultMessage='Level up your trading' />
      </Title>
      <Description>
        <FormattedMessage
          id='copy.exchange_promo.body'
          defaultMessage='Get lower fees, more trading pairs, and 24/7 live support on the Blockchain.com Exchange.'
        />
      </Description>
    </Body>
    <Button onClick={onClick} data-e2e='exchange-promo-cta' type='button'>
      <FormattedMessage id='copy.exchange_promo.cta' defaultMessage='Get Started' />
    </Button>
    <CloseIcon onClick={onClose} color={SemanticColors.medium} size='medium' />
  </PromoCard>
)

export default ExchangePromo
