import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { merge, lift } from 'ramda'
import styled from 'styled-components'
import { actions, selectors } from 'data'
import { Row, ColLeft, ColRight, ColLeftInner } from '../styled'
import { Button, Text, Icon } from 'blockchain-info-components'
import { Faq, FaqHeader, FaqContent } from 'components/FaqItem'
import { OrderDetailsTable, OrderDetailsRow } from './OrderDetails'
import { spacing, flex } from 'services/StyleService'

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

  handleSubmit (quote, accounts) {
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
    return (
      <OrderDetailsTable style={spacing('mt-20')}>
        {this.renderDetailsRow('orderDetails.exchangeRate', 'Exchange Rate', '1 BTC = $8,331.75')}
        {this.renderDetailsRow('orderDetails.purchaseAmount', 'BTC Amount to Purchase', '0.2365 BTC = ($1,971.49)')}
        {this.renderDetailsRow('orderDetails.tradingFee', 'Trading Fee', '0.001 BTC ($8.34)')}
        {this.renderDetailsRow('orderDetails.transactionFee', 'Transaction Fee', '0.0001 ($0.83)')}
        {this.renderDetailsRow('orderDetails.willReceiveAmount', 'Amount to be Received', '0.2354 BTC ($1,961.63)')}
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
    let { quoteR, accountsR } = this.props
    let { info } = this.state

    let createSubmit = (quote, accounts) => () => this.handleSubmit(quote, accounts)
    let handleSubmit = lift(createSubmit)(quoteR, accountsR).getOrElse(null)

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
          <Button nature='primary' fullwidth disabled={!handleSubmit} onClick={handleSubmit}>
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
  accountsR: selectors.core.data.sfox.getAccounts(state)
})

export default connect(mapState, actions.core.data.sfox)(Submit)
