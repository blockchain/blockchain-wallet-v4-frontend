import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors'
import { Row } from '../Layout'
import { Button } from 'blockchain-info-components'

export const MinMaxButton = styled(Button)`
  width: 48%;
  font-size: 10px;
  justify-content: space-between;
  > * {
    color: ${props => props.theme['brand-primary']};
  }
`
export const MinMaxValue = styled.div`
  font-weight: 600;
  font-size: 14px;
`

const formatAmount = (isFiat, symbol, value) =>
  isFiat ? `${symbol}${value}` : `${value} ${symbol}`

export class MinMaxButtons extends React.PureComponent {
  render () {
    const {
      disabled,
      minIsFiat,
      minSymbol,
      minAmount,
      maxIsFiat,
      maxSymbol,
      maxAmount,
      actions
    } = this.props

    return (
      <Row>
        <MinMaxButton fullwidth disabled={disabled} onClick={actions.useMin}>
          <FormattedMessage
            id='scenes.exchange.exchangeform.min'
            defaultMessage='MIN'
          />
          &nbsp;
          <MinMaxValue>
            {!disabled && formatAmount(minIsFiat, minSymbol, minAmount)}
          </MinMaxValue>
        </MinMaxButton>
        <MinMaxButton fullwidth disabled={disabled} onClick={actions.useMax}>
          <FormattedMessage
            id='scenes.exchange.exchangeform.max'
            defaultMessage='MAX'
          />
          &nbsp;
          <MinMaxValue>
            {!disabled && formatAmount(maxIsFiat, maxSymbol, maxAmount)}
          </MinMaxValue>
        </MinMaxButton>
      </Row>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.exchange, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(MinMaxButtons)
