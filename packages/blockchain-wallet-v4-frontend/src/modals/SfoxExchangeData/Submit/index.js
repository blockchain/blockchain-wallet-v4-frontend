import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { merge } from 'ramda'
import { Row, ColLeft, ColRight, ColLeftInner, Title, Subtitle } from '../styled'
import { Button, Text } from 'blockchain-info-components'
import { Faq, FaqHeader, FaqContent } from 'components/FaqItem'
import { OrderDetailsTable, OrderDetailsRow } from './OrderDetails'

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
  }

  handleSubmit () {
  }

  handleToggleInfo (name) {
    return () => this.setState({
      info: merge(this.state.info, {
        [name]: !this.state.info[name]
      })
    })
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
    let { info } = this.state
    return (
      <Row>
        <ColLeft>
          <ColLeftInner>
            <Title>
              <FormattedMessage id='placeholder' defaultMessage='Confirm Order' />
            </Title>
            <Subtitle>
              <FormattedMessage id='placeholder' defaultMessage='Review your trade details below. If everything looks right, click "Submit" to complete your order.' />
            </Subtitle>
            <OrderDetailsTable>
              {this.renderDetailsRow('orderDetails.exchangeRate', 'Exchange Rate', '1 BTC = $8,331.75')}
              {this.renderDetailsRow('orderDetails.purchaseAmount', 'BTC Amount to Purchase', '0.2365 BTC = ($1,971.49)')}
              {this.renderDetailsRow('orderDetails.tradingFee', 'Trading Fee', '0.001 BTC ($8.34)')}
              {this.renderDetailsRow('orderDetails.transactionFee', 'Transaction Fee', '0.0001 ($0.83)')}
              {this.renderDetailsRow('orderDetails.willReceiveAmount', 'Amount to be Received', '0.2354 BTC ($1,961.63)')}
            </OrderDetailsTable>
          </ColLeftInner>
        </ColLeft>
        <ColRight>
          <Button nature='primary' fullwidth onClick={this.handleSubmit}>
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

export default Submit
