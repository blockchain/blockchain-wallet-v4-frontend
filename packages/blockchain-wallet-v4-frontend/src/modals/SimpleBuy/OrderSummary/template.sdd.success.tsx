import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { getBaseAmount, getBaseCurrency } from 'data/components/simpleBuy/model'

import { Props as OwnProps, SuccessStateType } from '.'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const IconWrapper = styled.div`
  display: flex;
  position: relative;
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
const CloseContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
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
const IconProgressBackground = styled.div<{ color: string }>`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme[props.color]};
`
const TitleWrapper = styled(Text)`
  margin: 32px 0 24px 0;
  width: 100%;
`
const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  a {
    color: ${props => props.theme.blue600};
    text-decoration: none;
    margin-left: 2px;
  }
`

const Success: React.FC<Props> = props => {
  const baseAmount = getBaseAmount(props.order)
  const baseCurrency = getBaseCurrency(props.order, props.supportedCoins)
  const days =
    props.withdrawLockCheck && props.withdrawLockCheck.lockTime
      ? moment.duration(props.withdrawLockCheck.lockTime, 'seconds').days()
      : 3

  const isTransactionPending =
    props.order.state === 'PENDING_DEPOSIT' &&
    props.order.attributes?.everypay?.paymentState ===
      'WAITING_FOR_3DS_RESPONSE'

  const handleCancel = () => {
    props.simpleBuyActions.cancelSBOrder(props.order)
  }

  return (
    <Wrapper>
      <FlyoutWrapper>
        <CloseContainer>
          <Icon
            cursor
            data-e2e='sbCloseModalIcon'
            name='close'
            size='20px'
            color='grey600'
            role='button'
            onClick={props.handleClose}
          />
        </CloseContainer>
      </FlyoutWrapper>

      <ContentWrapper>
        <Content>
          {isTransactionPending ? (
            <IconWrapper>
              <IconProgressBackground color='orange100'>
                <Icon color='orange600' name='pending' size='30px' />
              </IconProgressBackground>
            </IconWrapper>
          ) : (
            <IconWrapper>
              <Icon
                color={
                  props.supportedCoins[props.order.outputCurrency].coinCode
                }
                name={props.supportedCoins[props.order.outputCurrency].coinCode}
                size='64px'
              />
              <IconBackground color='white'>
                <Icon
                  name='checkmark-circle-filled'
                  size='24px'
                  color='green400'
                />
              </IconBackground>
            </IconWrapper>
          )}

          <TitleWrapper>
            <Text
              data-e2e='sbSddPurchasing'
              size='20px'
              weight={600}
              color='grey800'
            >
              {isTransactionPending ? (
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
              {isTransactionPending ? (
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.available1'
                  defaultMessage='Your {coin} is now available in your Trading Account.'
                  values={{
                    coin: baseCurrency
                  }}
                />
              ) : (
                <FormattedMessage
                  id='modals.simplebuy.summary.pending_buy_description'
                  defaultMessage='Once you finalize your credit card information, your buy order will complete.'
                />
              )}
            </Text>
          </TitleWrapper>

          <Bottom>
            {props.order.state === 'PENDING_CONFIRMATION' ||
              (props.order.state === 'PENDING_DEPOSIT' &&
                !props.order.paymentMethodId && (
                  <Button
                    data-e2e='sbSDDCancelPending'
                    size='16px'
                    height='48px'
                    nature='light-red'
                    onClick={handleCancel}
                    style={{ marginBottom: '16px' }}
                  >
                    <FormattedMessage
                      id='modals.simplebuy.summary.cancelbuy'
                      defaultMessage='Cancel Buy'
                    />
                  </Button>
                ))}

            {isTransactionPending && (
              <Button
                data-e2e='sbSDDRetryCard'
                size='16px'
                height='48px'
                nature='primary'
                onClick={() =>
                  props.simpleBuyActions.setStep({
                    step: '3DS_HANDLER',
                    order: props.order
                  })
                }
                style={{ marginBottom: '16px' }}
              >
                <FormattedMessage
                  id='modals.simplebuy.summary.complete_card_payment'
                  defaultMessage='Complete Card Payment'
                />
              </Button>
            )}

            {!isTransactionPending && (
              <Button
                data-e2e='sbSDDOverviewOkButton'
                size='16px'
                height='48px'
                nature='primary'
                onClick={() => {
                  props.simpleBuyActions.setStep({
                    step: 'UPGRADE_TO_GOLD'
                  })
                  props.simpleBuyActions.updateSddTransactionFinished()
                }}
                style={{ marginBottom: '32px' }}
              >
                <FormattedMessage id='buttons.ok' defaultMessage='OK' />
              </Button>
            )}

            {!isTransactionPending && (
              <Text color='grey600' size='12px' weight={500}>
                <span>
                  {days === 0 || days === 1 ? (
                    <FormattedMessage
                      id='modals.simplebuy.summary.disclaimer'
                      defaultMessage='You will not be able to Send or Withdraw these funds from your Wallet for the next 1 day.'
                    />
                  ) : (
                    <FormattedMessage
                      id='modals.simplebuy.summary.disclaimer_plural'
                      defaultMessage='You will not be able to Send or Withdraw these funds from your Wallet for the next {days} days.'
                      values={{ days }}
                    />
                  )}
                  <a
                    href='https://support.blockchain.com/hc/en-us/articles/360048200392-Why-can-t-I-withdraw-my-crypto-'
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    <FormattedMessage
                      id='modals.simplebuy.summary.learn_more'
                      defaultMessage='Learn more'
                    />
                  </a>
                  {'.'}
                </span>
              </Text>
            )}
          </Bottom>
        </Content>
      </ContentWrapper>
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
