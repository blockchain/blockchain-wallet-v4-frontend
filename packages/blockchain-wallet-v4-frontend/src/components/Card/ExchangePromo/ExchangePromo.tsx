import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon } from 'blockchain-info-components'
import chart from 'blockchain-info-components/src/Images/img/exchange-chart.svg'
import { Card } from 'components/Card'

const PromoCard = styled(Card)`
  background-color: black;
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 99;
  height: 218px;
  width: 400px;
  border-radius: 20px;
  color: white;
  padding: 1.25rem;

  h2 {
    font-weight: 600;
    font-size: 1rem;
    line-height: 150%;
  }

  p,
  button {
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  button {
    padding: 8px 14px;
    color: black;
  }
`

const IconWrapper = styled.div`
  background: white;
  padding: 10px;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
`

const Chart = styled.img`
  position: absolute;
  top: 0;
  right: 0;
`

const CloseIcon = styled(Icon)`
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
      <Icon name='blockchain-logo' color='black' size='1.5rem' />
    </IconWrapper>
    <Chart alt='exchange candle chart' src={chart} />
    <h2>
      <FormattedMessage id='copy.exchange_promo.title' defaultMessage='Level up your trading' />
    </h2>
    <p>
      <FormattedMessage
        id='copy.exchange_promo.body'
        defaultMessage='Get lower fees, more trading pairs, and 24/7 live support on the Blockchain.com Exchange.'
      />
    </p>
    <Button onClick={onClick} data-e2e='exchange-promo-cta' type='button'>
      <FormattedMessage id='copy.exchange_promo.cta' defaultMessage='Get Started' />
    </Button>
    <CloseIcon onClick={onClose} name='close-circle' color='white' size='2rem' />
  </PromoCard>
)

export default ExchangePromo
