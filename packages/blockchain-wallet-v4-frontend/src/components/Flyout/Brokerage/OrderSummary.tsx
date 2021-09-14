import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { OrderType, SBOrderStateType, SBPaymentTypes } from 'blockchain-wallet-v4/src/types'

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
  const isPendingAch = isPendingDeposit && paymentType === SBPaymentTypes.BANK_TRANSFER
  const isTransactionPending = isPendingDeposit && paymentState === 'WAITING_FOR_3DS_RESPONSE'

  const days = moment.duration(lockTime, 'seconds').days()
  return (
    <Container>
      <Header data-e2e='sbCloseModalIcon' mode='close' onClick={handleClose} />
      <Content mode='middle'>
        <div style={{ padding: '0 77px', textAlign: 'center' }}>
          <IconWrapper>
            <Icon color={outputCurrency} name={outputCurrency} size='64px' />

            {orderState === 'FINISHED' ? (
              <IconBackground color='white'>
                <Icon name='checkmark-circle-filled' size='24px' color='green400' />
              </IconBackground>
            ) : orderState === 'FAILED' ? (
              <IconBackground color='white'>
                <Icon name='close-circle' size='32px' color='orange500' />
              </IconBackground>
            ) : (
              <IconBackground color='grey600'>
                <Icon name='pending' size='32px' color='white' />
              </IconBackground>
            )}
          </IconWrapper>
          <TitleWrapper>
            <Text data-e2e='sbSddPurchasing' size='20px' weight={600} color='grey800'>
              {isPendingAch ? (
                <FormattedMessage
                  id='modals.simplebuy.summary.buy_started'
                  defaultMessage='{amount} {coin} Buy Started'
                  values={{
                    amount: baseAmount,
                    coin: baseCurrency
                  }}
                />
              ) : isPendingDeposit ? (
                <FormattedMessage
                  id='modals.simplebuy.summary.pending_buy'
                  defaultMessage='Pending Buy'
                />
              ) : orderState === 'FAILED' ? (
                <FormattedMessage
                  id='copy.bank_linked_error_title_connectionrejected'
                  defaultMessage='Connection Rejected'
                />
              ) : (
                <FormattedMessage
                  id='modals.simplebuy.summary.purchased'
                  defaultMessage='{amount} {coin} Purchased'
                  values={{
                    amount: baseAmount,
                    coin: baseCurrency
                  }}
                />
              )}
            </Text>

            <Text size='14px' weight={500} color='grey600' style={{ marginTop: '8px' }}>
              {orderState === 'FINISHED' && (
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.available1'
                  defaultMessage='Your {coin} is now available in your Trading Account.'
                  values={{
                    coin: baseCurrency
                  }}
                />
              )}
              {orderState === 'FAILED' && (
                <>
                  <FormattedMessage
                    id='modals.simplebuy.rejected.bank_failed'
                    defaultMessage='Please try making your purchase again. If this keeps happening, please'
                  />{' '}
                  <Link
                    size='14px'
                    weight={500}
                    target='_blank'
                    href='https://support.blockchain.com/hc/en-us/sections/360007997071-Buy-Crypto'
                  >
                    <FormattedMessage
                      id='buttons.contact_support'
                      defaultMessage='Contact Support'
                    />
                  </Link>
                  .
                </>
              )}
              {isPendingDeposit ||
                (orderState === 'PENDING_CONFIRMATION' && (
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.pending1'
                    defaultMessage='Your order is pending. Your funds will be available in your Trading Account once the order is complete.'
                  />
                ))}
              {isPendingAch && (
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.ach_pending'
                  defaultMessage='We are completing your purchase now. Expect the funds to be withdrawn from your bank in 5 business days. Check the status of your order at anytime from Wallet’s Activity.'
                />
              )}
            </Text>
            {frequencyText && orderState !== 'FAILED' && (
              <Text size='14px' weight={500} color='grey600' style={{ marginTop: '8px' }}>
                <FormattedMessage
                  id='modals.simplebuy.recurringbuy.success'
                  defaultMessage='We will buy {amount} of Bitcoin {frequency} at that moment’s market price. Cancel this recurring buy at anytime.'
                  values={{
                    amount: `${currencySymbol}${counterAmount}`,
                    frequency: frequencyText
                  }}
                />
              </Text>
            )}
          </TitleWrapper>
          {isTransactionPending && (
            <Bottom>
              <Button
                data-e2e='sbRetryCard'
                size='16px'
                height='48px'
                nature='primary'
                onClick={handleCompleteButton}
              >
                <FormattedMessage
                  id='modals.simplebuy.summary.complete_card_payment'
                  defaultMessage='Complete Card Payment'
                />
              </Button>
            </Bottom>
          )}
          {orderType === 'BUY' &&
            (paymentType === SBPaymentTypes.PAYMENT_CARD ||
              paymentType === SBPaymentTypes.USER_CARD) && (
              <BottomInfo>
                <Text color='grey600' size='14px' weight={500}>
                  <FormattedMessage
                    id='modals.simplebuy.summary.complete_card_info_main'
                    defaultMessage='Your final amount might change due to market activity. For security purposes, a {days} holding period will be applied to your funds. You can Sell or Swap during this time. We will notify you once the funds are available to be withdrawn.'
                    values={{ days }}
                  />
                </Text>
                <Text color='grey600' size='14px' weight={500} style={{ marginTop: '16px' }}>
                  <span>
                    <FormattedMessage
                      id='modals.simplebuy.summary.complete_card_info_additional'
                      defaultMessage='In the meantime, you can sell into Cash, swap, and trade within Blockchain.com.'
                    />{' '}
                    <a
                      href='https://support.blockchain.com/hc/en-us/articles/360048200392'
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      <FormattedMessage id='copy.learn_more' defaultMessage='Learn more' />
                    </a>
                  </span>
                </Text>
              </BottomInfo>
            )}
          {orderType === 'BUY' &&
            paymentType === SBPaymentTypes.BANK_TRANSFER &&
            orderState !== 'FAILED' &&
            !isPendingAch && (
              <BottomInfo>
                <Text color='grey600' size='14px' weight={500}>
                  <FormattedMessage
                    id='modals.simplebuy.summary.ach_lock'
                    defaultMessage='Note: You will not be able to Send or Withdraw these funds from your Wallet for the next {days} days.'
                    values={{ days }}
                  />{' '}
                  <span>
                    <a
                      href='https://support.blockchain.com/hc/en-us/articles/360048200392'
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      <FormattedMessage id='copy.learn_more' defaultMessage='Learn more' />
                    </a>
                  </span>
                </Text>
              </BottomInfo>
            )}
        </div>
      </Content>
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

export type Props = {
  baseAmount: string
  baseCurrency: string
  children?: React.ReactNode
  counterAmount: string
  currencySymbol: string
  frequencyText?: React.ReactNode | string
  handleClose: () => void
  handleCompleteButton?: () => void
  handleOkButton: () => void
  lockTime: number
  orderState: SBOrderStateType
  orderType: OrderType
  outputCurrency: string
  paymentState: 'WAITING_FOR_3DS_RESPONSE' | null
  paymentType: SBPaymentTypes
}

export default OrderSummary
