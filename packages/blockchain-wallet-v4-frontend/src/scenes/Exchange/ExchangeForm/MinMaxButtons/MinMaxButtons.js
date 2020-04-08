import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { Button } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { formatAmount } from '../services'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { Row } from '../Layout'
import React from 'react'
import styled from 'styled-components'

export const MinMaxButton = styled(Button)`
  width: 48%;
  font-size: 10px;
  height: 48px;
  border-radius: 4px;
  justify-content: space-between;
  border-color: ${props => props.theme.grey200};
  > * {
    color: ${props => props.theme.blue900};
    font-weight: 500;
  }
`
export const MinMaxValue = styled.div`
  font-weight: 500;
  font-size: 14px;
`
const MinMaxRow = styled(Row)`
  padding: 20px 32px;
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
        <MinMaxButton
          data-e2e='exchangeUseMinButton'
          fullwidth
          disabled={disabled}
          onClick={actions.useMin}
        >
          <FormattedMessage
            id='scenes.exchange.exchangeform.min'
            defaultMessage='MIN'
          />
          &nbsp;
          <MinMaxValue data-e2e='exchangeMinValue'>
            {!disabled && formatAmount(minIsFiat, minSymbol, minAmount)}
          </MinMaxValue>
        </MinMaxButton>
        <MinMaxButton
          data-e2e='exchangeUseMaxButton'
          fullwidth
          disabled={disabled}
          onClick={actions.useMax}
        >
          <FormattedMessage
            id='scenes.exchange.exchangeform.max'
            defaultMessage='MAX'
          />
          &nbsp;
          <MinMaxValue data-e2e='exchangeMaxValue'>
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
