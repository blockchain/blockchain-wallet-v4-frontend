import React from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import moment from 'moment'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import {
  getBaseAmount,
  getBaseCurrency,
  getOrderType
} from 'data/components/simpleBuy/model'

import { Props as OwnProps, SuccessStateType } from '.'
import InterestBanner from './InterestBanner'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  height: 100%;
`
const BottomInterest = styled(FlyoutWrapper)`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  height: 180px;
`
const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  padding: 0 40px;
  flex: 1;
  justify-content: center;
`
const Content = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
  min-height: 250px;
  width: 100%;
`
const IconBackground = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 28px;
  z-index: 100;
  position: absolute;
  right: -5px;
  background: ${props => props.theme[props.color]};
`
const IconWrapper = styled.div`
  display: flex;
  position: relative;
`
const TitleWrapper = styled(Text)`
  margin: 32px 0 24px 0;
  width: 100%;
`

const BottomInfo = styled(Bottom)`
  text-align: center;
  a {
    color: ${props => props.theme.blue600};
    text-decoration: none;
  }
`

const Success: React.FC<Props> = props => {
  const orderType = getOrderType(props.order)
  const baseAmount = getBaseAmount(props.order)
  const baseCurrency = getBaseCurrency(props.order, props.supportedCoins)
  const days =
    props.withdrawLockCheck && props.withdrawLockCheck.lockTime
      ? moment.duration(props.withdrawLockCheck.lockTime, 'seconds').days()
      : 3

  const isPendingDeposit = props.order.state === 'PENDING_DEPOSIT'
  const isPendingAch =
    isPendingDeposit && props.order.paymentType === 'BANK_TRANSFER'
  const isTransactionPending =
    isPendingDeposit &&
    props.order.attributes?.everypay?.paymentState ===
      'WAITING_FOR_3DS_RESPONSE'
  const { show } = props.afterTransaction

  return (
    <Wrapper>
      <ContentWrapper>
        <Content>
          <IconWrapper>
            <Icon
              color={props.supportedCoins[props.order.outputCurrency].coinCode}
              name={props.supportedCoins[props.order.outputCurrency].coinCode}
              size='64px'
            />

            {props.order.state === 'FINISHED' ? (
              <IconBackground color='white'>
                <Icon
                  name='checkmark-circle-filled'
                  size='24px'
                  color='green400'
                />
              </IconBackground>
            ) : (
              <IconBackground color='grey600'>
                <Icon name='pending' size='32px' color='white' />
              </IconBackground>
            )}
          </IconWrapper>
          <TitleWrapper>
            <Text
              data-e2e='sbSddPurchasing'
              size='20px'
              weight={600}
              color='grey800'
            >
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

            <Text
              size='14px'
              weight={500}
              color='grey600'
              style={{ marginTop: '8px' }}
            >
              {props.order.state === 'FINISHED' && (
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.available1'
                  defaultMessage='Your {coin} is now available in your Trading Account.'
                  values={{
                    coin: baseCurrency
                  }}
                />
              )}
              {props.order.state === 'PENDING_DEPOSIT' ||
                (props.order.state === 'PENDING_CONFIRMATION' && (
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
          </TitleWrapper>
          {isTransactionPending && (
            <Bottom>
              <Button
                data-e2e='sbRetryCard'
                size='16px'
                height='48px'
                nature='primary'
                onClick={() =>
                  props.simpleBuyActions.setStep({
                    step: '3DS_HANDLER',
                    order: props.order
                  })
                }
              >
                <FormattedMessage
                  id='modals.simplebuy.summary.complete_card_payment'
                  defaultMessage='Complete Card Payment'
                />
              </Button>
            </Bottom>
          )}

          {orderType === 'BUY' &&
            (props.order.paymentType === 'PAYMENT_CARD' ||
              props.order.paymentType === 'USER_CARD') && (
              <BottomInfo>
                <Text color='grey600' size='14px' weight={500}>
                  <FormattedHTMLMessage
                    id='modals.simplebuy.summary.complete_card_info_main'
                    defaultMessage='For your security, first time card purchases are subject to a {days} day holding period before you can send or withdraw your purchased crypto. We will notify you when the hold is lifted.'
                    values={{ days: days }}
                  />
                </Text>
                <Text
                  color='grey600'
                  size='14px'
                  weight={500}
                  style={{ marginTop: '16px' }}
                >
                  <span>
                    <FormattedMessage
                      id='modals.simplebuy.summary.complete_card_info_additional'
                      defaultMessage='In the meantime, you can sell into Cash, swap, and trade within Blockchain.com.'
                    />
                    <a
                      href='https://support.blockchain.com/hc/en-us/articles/360048200392'
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      <FormattedMessage
                        id='modals.simplebuy.summary.learn_more'
                        defaultMessage='Learn more'
                      />
                    </a>
                  </span>
                </Text>
              </BottomInfo>
            )}
          {orderType === 'BUY' &&
            props.order.paymentType === 'BANK_TRANSFER' &&
            !isPendingAch && (
              <BottomInfo>
                <Text color='grey600' size='14px' weight={500}>
                  <FormattedHTMLMessage
                    id='modals.simplebuy.summary.ach_lock'
                    defaultMessage='Note: You will not be able to Send or Withdraw these funds from your Wallet for the next {days} days.'
                    values={{ days: days }}
                  />{' '}
                  <span>
                    <a
                      href='https://support.blockchain.com/hc/en-us/articles/360048200392'
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      <FormattedMessage
                        id='modals.simplebuy.summary.learn_more'
                        defaultMessage='Learn more'
                      />
                    </a>
                  </span>
                </Text>
              </BottomInfo>
            )}
        </Content>
      </ContentWrapper>
      {orderType === 'BUY' &&
        (props.order.paymentType === 'PAYMENT_CARD' ||
          props.order.paymentType === 'USER_CARD' ||
          props.order.paymentType === 'BANK_TRANSFER' ||
          props.order.paymentType === 'FUNDS') &&
        show && (
          <BottomInterest>
            <InterestBanner {...props} />
          </BottomInterest>
        )}
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
