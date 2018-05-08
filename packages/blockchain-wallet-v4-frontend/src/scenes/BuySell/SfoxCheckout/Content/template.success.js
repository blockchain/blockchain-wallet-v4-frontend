import React from 'react'
import { filter } from 'ramda'
import styled from 'styled-components'
import OrderHistoryTable from 'components/BuySell/OrderHistoryTable'
import { Text } from 'blockchain-info-components'
import { determineStep, determineReason } from 'services/SfoxService'
import { flex } from 'services/StyleService'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import Stepper, { StepView } from 'components/Utilities/Stepper'
import OrderCheckout from './OrderCheckout'
import { OrderDetails, OrderSubmit } from './OrderReview'

const CheckoutWrapper = styled.div`
  width: 50%;
`
const OrderSubmitWrapper = CheckoutWrapper.extend`
  width: 35%;
  padding: 30px 30px 30px 10%;
`
const OrderHistoryWrapper = styled.div`
  width: 100%;
  > div:last-child > div:last-child {
    margin-bottom: 0px;
  }
`
const OrderHistoryContent = styled.div`
  > div:first-child {
    margin-bottom: 10px;
  }
  > div:last-child {
    margin-bottom: 20px;
  }
`

const isPending = (t) => t.state === 'processing'
const isCompleted = (t) => t.state !== 'processing'

const Success = props => {
  const {
    changeBuySellTabStatus,
    fetchBuyQuote,
    fetchSellQuote,
    refreshQuote,
    submitBuyQuote,
    submitSellQuote,
    handleTrade,
    buyQuoteR,
    sellQuoteR,
    base,
    errors,
    showModal,
    handleTradeDetailsClick,
    clearTradeError,
    ...rest } = props

  const accounts = Remote.of(props.value.accounts).getOrElse([])
  const profile = Remote.of(props.value.profile).getOrElse({ account: { verification_status: {} }, limits: { buy: 0, sell: 0 } })
  const verificationStatus = Remote.of(props.value.verificationStatus).getOrElse({ level: 'unverified', required_docs: [] })
  const payment = Remote.of(props.payment).getOrElse({ effectiveBalance: 0 })

  const { trades, type, busy } = rest
  const step = determineStep(profile, verificationStatus, accounts)
  const reason = determineReason(type, profile, verificationStatus, accounts)
  const finishAccountSetup = () => showModal('SfoxExchangeData', { step })

  const limits = {
    buy: {
      min: 10,
      max: profile.limits.buy
    },
    sell: {
      min: 10,
      max: profile.limits.sell,
      effectiveMax: payment && payment.effectiveBalance
    }
  }

  if (type === 'buy' || !type) {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <OrderCheckout
              quoteR={buyQuoteR}
              account={accounts[0]}
              onFetchQuote={fetchBuyQuote}
              reason={reason}
              finishAccountSetup={finishAccountSetup}
              limits={limits.buy}
              type={'buy'}
            />
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <div style={flex('row')}>
            <CheckoutWrapper>
              <OrderDetails
                quoteR={buyQuoteR}
                account={accounts[0]}
                onRefreshQuote={refreshQuote}
                type={'buy'}
              />
            </CheckoutWrapper>
            <OrderSubmitWrapper style={{ ...flex('col') }}>
              <OrderSubmit
                quoteR={buyQuoteR}
                onSubmit={submitBuyQuote}
                busy={busy}
                clearTradeError={clearTradeError}
              />
            </OrderSubmitWrapper>
          </div>
        </StepView>
      </Stepper>
    )
  } else if (type === 'sell') {
    return (
      <Stepper initialStep={0}>
        <StepView step={0}>
          <CheckoutWrapper>
            <OrderCheckout
              quoteR={sellQuoteR}
              account={accounts[0]}
              onFetchQuote={fetchSellQuote}
              reason={reason}
              finishAccountSetup={finishAccountSetup}
              limits={limits.sell}
              type={'sell'}
            />
          </CheckoutWrapper>
        </StepView>
        <StepView step={1}>
          <div style={flex('row')}>
            <CheckoutWrapper>
              <OrderDetails
                quoteR={sellQuoteR}
                account={accounts[0]}
                onRefreshQuote={refreshQuote}
                type={'sell'}
              />
            </CheckoutWrapper>
            <OrderSubmitWrapper style={{ ...flex('col') }}>
              <OrderSubmit
                quoteR={sellQuoteR}
                onSubmit={submitSellQuote}
                busy={busy}
                clearTradeError={clearTradeError}
              />
            </OrderSubmitWrapper>
          </div>
        </StepView>
      </Stepper>
    )
  } else if (trades) {
    return (
      <OrderHistoryWrapper>
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.sfoxcheckout.trades.pending' defaultMessage='Pending Orders' />
          </Text>
          <OrderHistoryTable trades={filter(isPending, trades)} conversion={1e8} handleDetailsClick={trade => showModal('SfoxTradeDetails', { trade })} />
        </OrderHistoryContent>
        <OrderHistoryContent>
          <Text size='15px' weight={400}>
            <FormattedMessage id='scenes.buysell.sfoxcheckout.trades.completed' defaultMessage='Completed Orders' />
          </Text>
          <OrderHistoryTable trades={filter(isCompleted, trades)} conversion={1e8} handleDetailsClick={trade => showModal('SfoxTradeDetails', { trade })} />
        </OrderHistoryContent>
      </OrderHistoryWrapper>
    )
  } else {
    return null
  }
}

export default Success
