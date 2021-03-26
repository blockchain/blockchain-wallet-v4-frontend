import React from 'react'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import {
  getCoinFromPair,
  getFiatFromPair,
  getSellBaseAmount,
  getSellCounterAmount
} from 'data/components/simpleBuy/model'

import { BuyOrSell } from '../model'
import { Props as OwnProps, SuccessStateType } from '.'
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
const Amount = styled.div`
  margin-top: 40px;
  > div {
    display: inline;
  }
`

const Success: React.FC<Props> = props => {
  const { sellOrder, supportedCoins } = props
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
                coinModel={supportedCoins[sellBaseCurrency]}
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
              color={supportedCoins[sellBaseCurrency].coinCode}
            >
              {supportedCoins[sellBaseCurrency].coinTicker}
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
                / 1 {supportedCoins[sellBaseCurrency].coinTicker}
              </Value>
            </Row>
          )}
          <Row>
            <Title>
              <FormattedMessage id='copy.amount' defaultMessage='Amount' />
            </Title>
            <Value data-e2e='sbPurchasing'>
              {sellBaseAmount} of {supportedCoins[sellBaseCurrency].coinTicker}
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
              ? `${supportedCoins[sellBaseCurrency].coinTicker} Trading Account`
              : `${supportedCoins[sellBaseCurrency].coinTicker} Private Key Wallet`}
          </Value>
        </Row>
      </div>
    </Wrapper>
  ) : null
}

type Props = OwnProps & SuccessStateType

export default Success
