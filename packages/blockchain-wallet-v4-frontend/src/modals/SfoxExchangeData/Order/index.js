import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Row, ColLeft, ColRight, ColLeftInner, Title, Subtitle } from '../styled'
import DecisionForm from './DecisionForm'

class Order extends Component {
  render () {
    return (
      <Row>
        <ColLeft>
          <ColLeftInner>
            <Title>
              <FormattedMessage id='sfoxexchangedata.link.title' defaultMessage='Create Your Order' />
            </Title>
            <Subtitle>
              <FormattedMessage id='sfoxexchangedata.link.subtitle' defaultMessage='You can buy or sell any of the available currencies.' />
            </Subtitle>
            <DecisionForm fiat='USD' />
          </ColLeftInner>
        </ColLeft>
        <ColRight>
          <span>Implement Ordering</span>
        </ColRight>
      </Row>
    )
  }
}

export default Order
