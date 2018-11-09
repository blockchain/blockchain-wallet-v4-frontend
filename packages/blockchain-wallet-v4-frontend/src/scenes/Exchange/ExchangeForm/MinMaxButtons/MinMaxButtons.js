import React from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { contains, equals, gte, isNil, prop } from 'ramda'

import { actions, model } from 'data'
import { getData } from './selectors'
import { Row } from '../Layout'
import { Button } from 'blockchain-info-components'

const {
  NO_LIMITS_ERROR,
  REACHED_DAILY_ERROR,
  REACHED_WEEKLY_ERROR,
  REACHED_ANNUAL_ERROR,
  MINIMUM_NO_LINK_ERROR
} = model.components.exchange

const MinMaxButton = styled(Button)`
  width: 48%;
  font-size: 10px;
  justify-content: space-between;
  > * {
    color: ${props => props.theme['brand-primary']};
  }
`
const MinMaxValue = styled.div`
  font-weight: 600;
  font-size: 14px;
`

const formatAmount = (isFiat, symbol, value) =>
  isFiat ? `${symbol}${value}` : `${value} ${symbol}`

class MinMaxButtons extends React.PureComponent {
  render () {
    const { error, min, max, actions } = this.props
    const minMaxDisabled =
      contains(error, [
        NO_LIMITS_ERROR,
        MINIMUM_NO_LINK_ERROR,
        REACHED_DAILY_ERROR,
        REACHED_WEEKLY_ERROR,
        REACHED_ANNUAL_ERROR
      ]) ||
      (equals(prop('symbol', min), prop('symbol', max)) &&
        gte(prop('amount', min), prop('amount', max))) ||
      isNil(min) ||
      isNil(max)
    return (
      <Row>
        <MinMaxButton
          fullwidth
          disabled={minMaxDisabled}
          onClick={actions.useMin}
        >
          <FormattedMessage
            id='scenes.exchange.exchangeform.min'
            defaultMessage='MIN'
          />
          &nbsp;
          <MinMaxValue>
            {!minMaxDisabled &&
              formatAmount(
                prop('fiat', min),
                prop('symbol', min),
                prop('amount', min)
              )}
          </MinMaxValue>
        </MinMaxButton>
        <MinMaxButton
          fullwidth
          disabled={minMaxDisabled}
          onClick={actions.useMax}
        >
          <FormattedMessage
            id='scenes.exchange.exchangeform.max'
            defaultMessage='MAX'
          />
          &nbsp;
          <MinMaxValue>
            {!minMaxDisabled &&
              formatAmount(
                prop('fiat', max),
                prop('symbol', max),
                prop('amount', max)
              )}
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
