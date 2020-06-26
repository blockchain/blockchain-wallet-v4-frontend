import { Button, Icon, Text } from 'blockchain-info-components'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'core/exchange/currency'
import { FiatType } from 'core/types'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { getCoinFromPair, getOrderType } from 'data/components/simpleBuy/model'
import { Props as OwnProps, SuccessStateType } from '.'
import { Status } from './model'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  height: 100%;
`
const Amount = styled.div`
  margin-top: 40px;
  > div {
    display: inline;
  }
`

const Success: React.FC<Props> = props => {
  const inputAmt =
    getOrderType(props.order.pair) === 'BUY'
      ? fiatToString({
          unit: props.order.inputCurrency as FiatType,
          value: convertBaseToStandard('FIAT', props.order.inputQuantity)
        })
      : convertBaseToStandard(
          getCoinFromPair(props.order.pair),
          props.order.inputQuantity
        )
  const outputAmt =
    getOrderType(props.order.pair) === 'BUY'
      ? convertBaseToStandard(
          getCoinFromPair(props.order.pair),
          props.order.outputQuantity
        )
      : fiatToString({
          unit: props.order.outputCurrency as FiatType,
          value: convertBaseToStandard('FIAT', props.order.outputQuantity)
        })
  const card =
    props.order.paymentMethodId &&
    props.cards.find(card => card.id === props.order.paymentMethodId)?.card

  return (
    <Wrapper>
      <div>
        <FlyoutWrapper>
          <TopText color='grey800' size='20px' weight={600}>
            {/* TODO: Simple Buy - order types */}
            <FormattedMessage
              id='modals.simplebuy.ordersummary'
              defaultMessage='Buy Order Summary'
            />
            <Icon
              cursor
              name='close'
              size='20px'
              color='grey600'
              onClick={() => props.handleClose()}
            />
          </TopText>
          <Amount>
            <Text color='grey800' data-e2e='sbAmount' size='32px' weight={600}>
              {inputAmt} of
            </Text>
            <Text
              size='32px'
              weight={600}
              color={props.supportedCoins[props.order.outputCurrency].colorCode}
            >
              {props.supportedCoins[props.order.outputCurrency].coinTicker}
            </Text>
          </Amount>
          <div style={{ margin: '16px 0' }}>
            <Status {...props} />
          </div>
          {props.order.state === 'PENDING_DEPOSIT' &&
            !props.order.paymentMethodId && (
              <Button
                fullwidth
                data-e2e='sbViewDetails'
                size='16px'
                height='48px'
                nature='primary'
                onClick={() =>
                  props.simpleBuyActions.setStep({
                    step: 'TRANSFER_DETAILS',
                    order: props.order
                  })
                }
              >
                <FormattedMessage
                  id='modals.simplebuy.summary.viewtransferdets'
                  defaultMessage='View Bank Transfer Details'
                />
              </Button>
            )}
        </FlyoutWrapper>
        <Row>
          <Title color='grey600' size='14px' weight={500}>
            <FormattedMessage
              id='modals.simplebuy.summary.txid'
              defaultMessage='Transaction ID'
            />
          </Title>
          <Value data-e2e='sbTransactionId'>{props.order.id}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.summary.created'
              defaultMessage='Created'
            />
          </Title>
          <Value data-e2e='sbCreated'>
            {moment(props.order.insertedAt).format('LLL')}
          </Value>
        </Row>
        {props.order.price ? (
          <>
            <Row>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.summary.rate'
                  defaultMessage='Exchange Rate'
                />
              </Title>
              <Value data-e2e='sbRate'>
                {fiatToString({
                  unit: props.order.inputCurrency as FiatType,
                  value: convertBaseToStandard('FIAT', props.order.price)
                })}{' '}
                / {props.order.outputCurrency}
              </Value>
            </Row>
            <Row>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.summary.value'
                  defaultMessage='Value'
                />
              </Title>
              <Value data-e2e='sbPurchasing'>
                {inputAmt} of{' '}
                {props.supportedCoins[props.order.outputCurrency].coinTicker}
              </Value>
            </Row>
          </>
        ) : (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.summary.purchasing'
                defaultMessage='Purchasing'
              />
            </Title>
            <Value data-e2e='sbPurchasing'>
              {inputAmt} of{' '}
              {props.supportedCoins[props.order.outputCurrency].coinTicker}
            </Value>
          </Row>
        )}
        {props.order.fee !== '0' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.summary.fee'
                defaultMessage='Fee'
              />
            </Title>
            <Value data-e2e='sbFee'>
              {fiatToString({
                unit: props.order.inputCurrency as FiatType,
                value: convertBaseToStandard('FIAT', props.order.fee)
              })}{' '}
              {props.order.inputCurrency}
            </Value>
          </Row>
        )}
        {props.order.outputQuantity !== '0' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.summary.sent_to'
                defaultMessage='Sent To'
              />
            </Title>
            <Value data-e2e='sbSentTo'>
              {props.order.outputCurrency} Trading Wallet
            </Value>
          </Row>
        )}
        {props.order.outputQuantity !== '0' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.confirm.total'
                defaultMessage='Total'
              />
            </Title>
            <Value data-e2e='sbSentTo'>
              {outputAmt} {props.order.outputCurrency}
            </Value>
          </Row>
        )}
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.summary.paymentmethod'
              defaultMessage='Payment Method'
            />
          </Title>
          <Value data-e2e='sbPaymentMethod'>
            {card
              ? `${card.label ? card.label : card.type} ····${card.number}`
              : 'Bank Wire Transfer'}
          </Value>
        </Row>
      </div>
      {props.order.state === 'PENDING_CONFIRMATION' ||
        (props.order.state === 'PENDING_DEPOSIT' &&
          !props.order.paymentMethodId && (
            <Bottom>
              <Button
                data-e2e='sbCancelPending'
                size='16px'
                height='48px'
                nature='light-red'
                onClick={() =>
                  props.simpleBuyActions.setStep({
                    step: 'CANCEL_ORDER',
                    order: props.order
                  })
                }
              >
                {/* TODO: Simple Buy - order types */}
                <FormattedMessage
                  id='modals.simplebuy.summary.cancelbuy'
                  defaultMessage='Cancel Buy'
                />
              </Button>
            </Bottom>
          ))}
      {props.order.state === 'PENDING_DEPOSIT' &&
        props.order.attributes &&
        props.order.attributes.everypay.paymentState ===
          'WAITING_FOR_3DS_RESPONSE' && (
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
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
