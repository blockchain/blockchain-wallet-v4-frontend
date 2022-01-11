import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import styled from 'styled-components'

import { BSOrderStateType, BSPaymentTypes, OrderType } from '@core/types'
import { Button, Icon, Link, Text } from 'blockchain-info-components'

import Container from '../Container'
import Content from '../Content'
import Footer from '../Footer'
import Header from '../Header'

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const IconBackground = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 28px;
  z-index: 100;
  background: ${(props) => props.theme[props.color]};
  transform: translateX(31px);
  position: absolute;
`
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
`
const TitleWrapper = styled(Text)`
  margin: 32px 0 24px 0;
  width: 100%;
`
const BottomInfo = styled(Bottom)`
  text-align: center;
  a {
    color: ${(props) => props.theme.blue600};
    text-decoration: none;
  }
`
const BottomPromo = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  height: 180px;
  margin-bottom: 15px;
`

const OrderSummary: React.FC<Props> = ({
  baseAmount,
  baseCurrency,
  children,
  counterAmount,
  currencySymbol,
  frequencyText,
  handleClose,
  handleCompleteButton,
  handleOkButton,
  lockTime,
  orderState,
  orderType,
  outputCurrency,
  paymentState,
  paymentType
}) => {
  const isPendingDeposit = orderState === 'PENDING_DEPOSIT'
  const isPendingAch = isPendingDeposit && paymentType === BSPaymentTypes.BANK_TRANSFER
  const isTransactionPending = isPendingDeposit && paymentState === 'WAITING_FOR_3DS_RESPONSE'

  const days = moment.duration(lockTime, 'seconds').days()
  return (
    <Container>
      <Content mode='middle' />
      <Footer>
        {children && <BottomPromo>{children}</BottomPromo>}

        {orderType === 'BUY' && orderState !== 'FAILED' && (
          <Button
            fullwidth
            data-e2e='sbDone'
            size='16px'
            height='48px'
            nature='primary'
            onClick={handleOkButton}
            style={{ marginBottom: '16px' }}
          >
            <FormattedMessage id='buttons.ok' defaultMessage='OK' />
          </Button>
        )}
      </Footer>
    </Container>
  )
}

export type Props = {}

export default OrderSummary
