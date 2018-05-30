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
import Helper from 'components/BuySell/FAQ'
import EmptyOrderHistoryContainer from 'components/BuySell/EmptyOrderHistory'

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
const faqList = [
  {
    question: <FormattedMessage id='scenes.buysell.sfoxcheckout.cyo.helper1.question' defaultMessage='What are the fees?' />,
    answer: <FormattedMessage id='scenes.buysell.sfoxcheckout.cyo.helper1.answer' defaultMessage='There is a trading fee that SFOX requires to execute a buy or sell trade. For sell trades specifically, there is an additional transaction fee that goes to network miners in order to send the amount you’re selling to SFOX.' />
  },
  {
    question: <FormattedMessage id='scenes.buysell.sfoxcheckout.cyo.helper2.question' defaultMessage='What is the exchange rate?' />,
    answer: <FormattedMessage id='scenes.buysell.sfoxcheckout.cyo.helper2.answer' defaultMessage='These rates are determined by the market; the broader ecosystem of other buyers and sellers. We fetch the most recent exchange rate and guarantee it for 30 seconds. The quote will automatically refresh every 30 seconds until you select ‘Submit’.' />
  },
  {
    question: <FormattedMessage id='scenes.buysell.sfoxcheckout.cyo.helper3.question' defaultMessage='How do I raise my limits?' />,
    answer: <FormattedMessage id='scenes.buysell.sfoxcheckout.cyo.helper3.answer' defaultMessage='Daily limits are determined by how much information has been submitted to, and verified by, SFOX— the highest daily limit being $10,000. Keep in mind: Your daily buy and sell limits directly impact each other (for example, If your limit is $10,000 and you decide to sell $5,000, you will have a limit to buy $5,000).' />
  }
]

const faqListHelper = () => faqList.map(el => <Helper question={el.question} answer={el.answer} />)

const isPending = (t) => t.state === 'processing'
const isCompleted = (t) => t.state !== 'processing'

const Success = props => {
  const {
    changeBuySellTabStatus,
    fetchBuyQuote,
    fetchSellQuote,
    refreshBuyQuote,
    refreshSellQuote,
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
    changeTab,
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
      <Stepper key='BuyStepper' initialStep={0}>
        <StepView step={0}>
          <div style={flex('row')}>
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
            <OrderSubmitWrapper>
              {faqListHelper()}
            </OrderSubmitWrapper>
          </div>
        </StepView>
        <StepView step={1}>
          <div style={flex('row')}>
            <CheckoutWrapper>
              <OrderDetails
                quoteR={buyQuoteR}
                account={accounts[0]}
                onRefreshQuote={refreshBuyQuote}
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
      <Stepper key='SellStepper' initialStep={0}>
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
                onRefreshQuote={refreshSellQuote}
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
    const conversion = {
      buy: 1e8,
      sell: 1e8
    }

    if (!trades.length) {
      return <EmptyOrderHistoryContainer changeTab={changeTab} />
    } else {
      return (
        <OrderHistoryWrapper>
          <OrderHistoryContent>
            <Text size='15px' weight={400}>
              <FormattedMessage id='scenes.buysell.sfoxcheckout.trades.pending' defaultMessage='Pending Orders' />
            </Text>
            <OrderHistoryTable trades={filter(isPending, trades)} conversion={conversion} handleDetailsClick={trade => showModal('SfoxTradeDetails', { trade })} />
          </OrderHistoryContent>
          <OrderHistoryContent>
            <Text size='15px' weight={400}>
              <FormattedMessage id='scenes.buysell.sfoxcheckout.trades.completed' defaultMessage='Completed Orders' />
            </Text>
            <OrderHistoryTable trades={filter(isCompleted, trades)} conversion={conversion} handleDetailsClick={trade => showModal('SfoxTradeDetails', { trade })} />
          </OrderHistoryContent>
        </OrderHistoryWrapper>
      )
    }
  } else {
    return null
  }
}

export default Success
