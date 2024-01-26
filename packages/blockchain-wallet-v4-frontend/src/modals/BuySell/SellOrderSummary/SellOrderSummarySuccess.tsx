import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { format } from 'date-fns'

import { fiatToString } from '@core/exchange/utils'
import { OrderType } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { selectors } from 'data'
import {
  getCoinFromPair,
  getFiatFromPair,
  getSellBaseAmount,
  getSellCounterAmount
} from 'data/components/buySell/model'
import { useShowConversionAlert } from 'hooks'

import { BuyOrSell } from '../model'
import { Props } from '.'
import { Amount, DisclaimerText, TopText, Wrapper } from './SellOrderSumary.styles'
import { Status } from './StatusMessage'

const Success: React.FC<Props> = ({ handleClose }) => {
  const sellOrder = useSelector(selectors.components.buySell.getSellOrder)

  const sellBaseAmount = sellOrder && getSellBaseAmount(sellOrder)
  const sellBaseCurrency = sellOrder ? getCoinFromPair(sellOrder.pair) : 'BTC'
  const sellCounterCurrency = sellOrder ? getFiatFromPair(sellOrder.pair) : 'USD'
  const isInternal = sellOrder?.kind.direction === 'INTERNAL'
  const sellCounterAmount = sellOrder ? getSellCounterAmount(sellOrder) : 0

  const { coinfig } = window.coins[sellCounterCurrency]

  const sellCurrencyName = coinfig.name || sellCounterCurrency

  const showConversionDisclaimer = useShowConversionAlert(coinfig)

  if (!sellOrder) return null

  return (
    <Wrapper>
      <div>
        <FlyoutWrapper>
          <TopText color='grey800' size='20px' weight={600}>
            <span>
              <BuyOrSell orderType={OrderType.SELL} crypto={sellBaseCurrency} />
            </span>
            <Icon cursor name='close' size='20px' color='grey600' onClick={handleClose} />
          </TopText>
          <Amount>
            <Text color='grey800' data-e2e='sbAmount' size='32px' weight={600}>
              {sellBaseAmount} of
            </Text>
            <Text size='32px' weight={600} color={sellBaseCurrency}>
              {sellBaseCurrency}
            </Text>
          </Amount>
          <div style={{ margin: '16px 0' }}>
            <Status sellOrder={sellOrder} />
          </div>
        </FlyoutWrapper>
        <Row>
          <Title color='grey600' size='14px' weight={500}>
            <FormattedMessage id='modals.simplebuy.summary.txid' defaultMessage='Transaction ID' />
          </Title>
          <Value data-e2e='sbTransactionId'>{sellOrder.id}</Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage id='modals.simplebuy.summary.created' defaultMessage='Created' />
          </Title>
          <Value data-e2e='sbCreated'>{format(new Date(sellOrder.createdAt), 'PPpp')}</Value>
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
        {sellOrder.priceFunnel.outputMoney !== '0' && sellOrder.state !== 'FAILED' && (
          <Row>
            <Title>
              <FormattedMessage id='modals.simplebuy.summary.sent_to' defaultMessage='Sent To' />
            </Title>
            <Value data-e2e='sbSentTo'>{sellCurrencyName}</Value>
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
            {isInternal ? `${sellBaseCurrency} Trading Account` : `${sellBaseCurrency} DeFi Wallet`}
          </Value>
        </Row>

        {showConversionDisclaimer && (
          <DisclaimerText>
            <FormattedMessage
              id='modals.simplebuy.confirm.conversion_legalese'
              defaultMessage='Your {coinName} ({symbol}) balance will be converted to USDC daily at 12:00 am UTC. To avoid any inconvenience buy crypto before the specified time.'
              values={{
                coinName: sellCurrencyName,
                symbol: sellCounterCurrency
              }}
            />
          </DisclaimerText>
        )}
      </div>
    </Wrapper>
  )
}

export default Success
