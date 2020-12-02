import { FormattedMessage } from 'react-intl'
import { Icon, Text } from 'blockchain-info-components'
import moment from 'moment'
import React from 'react'

import { fiatToString } from 'core/exchange/currency'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import {
  getCoinFromPair,
  getFiatFromPair,
  getSellBaseAmount,
  getSellCounterAmount
} from 'data/components/simpleBuy/model'
import styled from 'styled-components'

import { BuyOrSell } from '../model'
import { Props as OwnProps } from '.'
import { Status } from './model'

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
// const Bottom = styled(FlyoutWrapper)`
//   display: flex;
//   justify-content: flex-end;
//   flex-direction: column;
//   height: 100%;
// `
const Amount = styled.div`
  margin-top: 40px;
  > div {
    display: inline;
  }
`

// const BottomInfo = styled(Bottom)`
//   text-align: center;
//   a {
//     color: ${props => props.theme.blue600};
//     text-decoration: none;
//   }
// `
// I have a lot of checks here and default values because sellOrder can be undefined. This
// this isn't an issue for regular orders even though their default state value is undefined as well
// Figure this out to clean up this code
const Success: React.FC<Props> = props => {
  const { sellOrder } = props
  const sellBaseAmount = sellOrder && getSellBaseAmount(sellOrder)
  const sellBaseCurrency = sellOrder ? getCoinFromPair(sellOrder.pair) : 'BTC'
  const sellCounterCurrency = sellOrder
    ? getFiatFromPair(sellOrder.pair)
    : 'USD'
  const isInternal = sellOrder?.kind.direction === 'INTERNAL'
  const sellCounterAmount = sellOrder ? getSellCounterAmount(sellOrder) : 0
  return sellOrder ? (
    <Wrapper>
      <div>
        <FlyoutWrapper>
          <TopText color='grey800' size='20px' weight={600}>
            <span>
              <BuyOrSell
                orderType={'SELL'}
                crypto={sellBaseCurrency}
                coinModel={props.supportedCoins[sellCounterCurrency]}
              />
            </span>
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
              {sellBaseAmount} of
            </Text>
            <Text
              size='32px'
              weight={600}
              color={props.supportedCoins[sellBaseCurrency].colorCode}
            >
              {sellBaseCurrency}
            </Text>
          </Amount>
          <div style={{ margin: '16px 0' }}>
            <Status {...props} />
          </div>
        </FlyoutWrapper>
        <Row>
          <Title color='grey600' size='14px' weight={500}>
            <FormattedMessage
              id='modals.simplebuy.summary.txid'
              defaultMessage='Transaction ID'
            />
          </Title>
          <Value data-e2e='sbTransactionId'>{sellOrder.id}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.summary.created'
              defaultMessage='Created'
            />
          </Title>
          <Value data-e2e='sbCreated'>
            {moment(sellOrder.createdAt).format('LLL')}
          </Value>
        </Row>

        <>
          {sellOrder.state !== 'FAILED' && (
            <Row>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.summary.rate'
                  defaultMessage='Exchange Rate'
                />
              </Title>
              <Value data-e2e='sbRate'>
                {fiatToString({
                  unit: sellCounterCurrency,
                  value: sellOrder.priceFunnel.price
                })}{' '}
                / 1 {sellBaseCurrency}
              </Value>
            </Row>
          )}
          <Row>
            <Title>
              <FormattedMessage id='copy.amount' defaultMessage='Amount' />
            </Title>
            <Value data-e2e='sbPurchasing'>
              {sellBaseAmount} of {sellBaseCurrency}
            </Value>
          </Row>
        </>
        {sellOrder.priceFunnel.outputMoney !== '0' &&
          sellOrder.state !== 'FAILED' && (
            <Row>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.summary.sent_to'
                  defaultMessage='Sent To'
                />
              </Title>
              <Value data-e2e='sbSentTo'>{sellCounterCurrency} Wallet</Value>
            </Row>
          )}
        {sellOrder.priceFunnel.outputMoney !== '0' && (
          <Row>
            <Title>
              <FormattedMessage id='copy.total' defaultMessage='Total' />
            </Title>
            <Value data-e2e='sbSentTotal'>
              {fiatToString({
                unit: sellCounterCurrency,
                value: sellCounterAmount
              })}
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
            {isInternal
              ? `${sellBaseCurrency} Trading Wallet`
              : `${sellBaseCurrency} Wallet`}
          </Value>
        </Row>
      </div>
      {/* {sellOrder.state === 'PENDING_CONFIRMATION' ||
        (sellOrder.state === 'PENDING_DEPOSIT' &&
           (
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
               
                  <FormattedMessage
                    id='modals.simplebuy.summary.cancelsell'
                    defaultMessage='Cancel Sell'
                  />
              
              </Button>
            </Bottom>
          ))} */}
    </Wrapper>
  ) : null
}

type Props = OwnProps

export default Success
