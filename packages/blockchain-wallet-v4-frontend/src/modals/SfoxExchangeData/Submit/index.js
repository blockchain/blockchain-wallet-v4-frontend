import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { merge, lift } from 'ramda'
import styled from 'styled-components'
import { actions, selectors } from 'data'
import { Row, ColLeft, ColRight, ColLeftInner } from 'components/BuySell/Signup'
import { Button, Text, Icon } from 'blockchain-info-components'
import { Faq, FaqHeader, FaqContent } from 'components/FaqItem'
import { OrderDetailsTable, OrderDetailsRow } from './OrderDetails'
import { spacing, flex } from 'services/StyleService'
import { Remote } from 'blockchain-wallet-v4/src'

const renderRemote = (remote, cases) => remote.cata({
  NotAsked: () => null,
  Loading: () => null,
  Success: () => null,
  Failure: () => null,
  ...cases
})

const FundingSource = ({ accounts }) => (
  <div style={flex('row align/center')}>
    <Icon style={spacing('mv-5 mh-15')} name='credit-card-filled' size='28px' />
    <div>
      <Text size='12px' weight='normal'>
        <FormattedMessage id='placeholder' defaultMessage='Card ending in' /> ({accounts[0].accountNumber})
      </Text>
      <Text size='12px' weight='normal'>
        <FormattedMessage id='placeholder' defaultMessage='Account holder' />: {accounts[0].name}
      </Text>
    </div>
  </div>
)

const FundingSourceWrapper = styled.div`
  width: 100%;
  border: 1px solid ${props => props.theme['gray-2']}
`

class Submit extends Component {
  constructor (props) {
    super(props)
    this.state = {
      info: {
        toggledOrderTime: false,
        toggledRates: false,
        toggledFees: false
      }
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderFundingSource = this.renderFundingSource.bind(this)
    this.renderDetailsTable = this.renderDetailsTable.bind(this)
  }

  handleSubmit (quote) {
    this.props.submitQuote(quote)
  }

  handleToggleInfo (name) {
    return () => this.setState({
      info: merge(this.state.info, {
        [name]: !this.state.info[name]
      })
    })
  }

  renderFundingSource (accounts) {
    return (
      <Fragment>
        <Text size='14px' weight='normal' style={spacing('mt-20')}>
          <FormattedMessage id='placeholder' defaultMessage='Your Connected Account' />:
        </Text>
        <FundingSourceWrapper style={spacing('mt-10')}>
          <FundingSource accounts={accounts} />
        </FundingSourceWrapper>
      </Fragment>
    )
  }

  renderDetailsTable (quote) {
    let txFee = 0.0001
    return (
      <OrderDetailsTable style={spacing('mt-20')}>
        {this.renderDetailsRow('orderDetails.exchangeRate', 'Exchange Rate', `1 BTC = $${quote.rate}`)}
        {this.renderDetailsRow('orderDetails.tradingFee', 'Trading Fee', `${parseFloat(quote.fee_amount).toFixed(2)} ${quote.fee_currency.toUpperCase()}`)}
        {this.renderDetailsRow('orderDetails.transactionFee', 'Transaction Fee', `${txFee} BTC ($${txFee * parseFloat(quote.rate)})`)}
        {this.renderDetailsRow('orderDetails.willReceiveAmount', 'Amount to be Received', `${quote.base_amount} BTC ($${quote.quote_amount})`)}
      </OrderDetailsTable>
    )
  }

  renderDetailsRow (id, message, value) {
    return (
      <OrderDetailsRow>
        <Text size='13px' weight={400}><FormattedMessage id={id} defaultMessage={message} /></Text>
        <Text size='13px' weight={300}>{value}</Text>
      </OrderDetailsRow>
    )
  }

  render () {
    let { quoteR, accountsR, tradeR } = this.props
    let { info } = this.state

    let createSubmit = (quote) => () => this.handleSubmit(quote)
    let handleSubmit = lift(createSubmit)(quoteR).getOrElse(null)

    return (
      <Row>
        <ColLeft>
          <ColLeftInner>
            <Text size='30px' weight={600}>
              <FormattedMessage id='placeholder' defaultMessage='Confirm Order' />
            </Text>
            <Text size='16px' weight={300} style={spacing('mt-10')}>
              <FormattedMessage id='placeholder' defaultMessage='Review your trade details below. If everything looks right, click "Submit" to complete your order.' />
            </Text>
            {accountsR.map(this.renderFundingSource).getOrElse(null)}
            {quoteR.map(this.renderDetailsTable).getOrElse(null)}
          </ColLeftInner>
        </ColLeft>
        <ColRight>
          <Button nature='primary' fullwidth disabled={!handleSubmit || Remote.Loading.is(tradeR)} onClick={handleSubmit}>
            <FormattedMessage id='continue' defaultMessage='Submit' />
          </Button>
          <Faq>
            <FaqHeader toggled={info.toggledOrderTime} handleToggle={this.handleToggleInfo('toggledOrderTime')}>
              <FormattedMessage id='placeholder' defaultMessage='How long will the buy order take?' />
            </FaqHeader>
            <FaqContent toggled={info.toggledOrderTime}>
              <FormattedMessage id='placeholder' defaultMessage='Quite a while.' />
            </FaqContent>
          </Faq>
          <Faq>
            <FaqHeader toggled={info.toggledRates} handleToggle={this.handleToggleInfo('toggledRates')}>
              <FormattedMessage id='placeholder' defaultMessage='Why does the exchange rate change?' />
            </FaqHeader>
            <FaqContent toggled={info.toggledRates}>
              <FormattedMessage id='placeholder' defaultMessage='Why not?' />
            </FaqContent>
          </Faq>
          <Faq>
            <FaqHeader toggled={info.toggledFees} handleToggle={this.handleToggleInfo('toggledFees')}>
              <FormattedMessage id='placeholder' defaultMessage='What are the fees?' />
            </FaqHeader>
            <FaqContent toggled={info.toggledFees}>
              <FormattedMessage id='placeholder' defaultMessage='Too high.' />
            </FaqContent>
          </Faq>
        </ColRight>
      </Row>
    )
  }
}

const mapState = (state) => ({
  quoteR: selectors.core.data.sfox.getBareQuote(state),
  accountsR: selectors.core.data.sfox.getAccounts(state),
  tradeR: selectors.core.data.sfox.getTrade(state)
})

export default connect(mapState, actions.modules.sfox)(Submit)
