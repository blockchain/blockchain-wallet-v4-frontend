import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'

import { actions } from 'data'
import { getData } from './selectors'
import { formatAmount } from '../services'
import { Row } from '../Layout'
import { Button } from 'blockchain-info-components'

export const MinMaxButton = styled(Button)`
  width: 48%;
  font-size: 10px;
  height: 48px;
  border-radius: 4px;
  justify-content: space-between;
  border-color: ${props => props.theme['gray-2']};
  > * {
    color: ${props => props.theme['brand-primary']};
    font-weight: 500;
  }
`
export const MinMaxValue = styled.div`
  font-weight: 500;
  font-size: 14px;
`
const MinMaxRow = styled(Row)`
  padding-bottom: 23px;
`
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
      <MinMaxRow>
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
      </MinMaxRow>
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
