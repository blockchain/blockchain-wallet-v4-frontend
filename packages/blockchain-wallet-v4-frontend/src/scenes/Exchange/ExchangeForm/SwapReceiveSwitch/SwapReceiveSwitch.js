import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { getData } from './selectors'

import { Cell, Row } from '../Layout'
import { Text } from 'blockchain-info-components'

const SwapReceiveRow = styled(Row)`
  padding-bottom: 0;
`
const SwapReceiveGap = styled(Cell)`
  min-width: 50px;
`
const ActiveCurrencyButton = styled.div`
  cursor: pointer;
  height: 11px;
  width: 11px;
  background-color: ${props => props.checked && props.theme[props.coin]};
  border-radius: 8px;
  margin-right: 8px;
  border: 1px solid
    ${props =>
      props.checked ? props.theme[props.coin] : props.theme['gray-4']};
`
const ClickableText = styled(Text)`
  cursor: pointer;
`

export const SwapReceiveSwitch = ({
  sourceCoin,
  targetCoin,
  sourceActive,
  targetActive,
  swapFix
}) => (
  <SwapReceiveRow>
    <Cell>
      <ActiveCurrencyButton
        data-e2e='exchangeExchangeRadioButton'
        onClick={() => {
          if (!sourceActive) swapFix()
        }}
        checked={sourceActive}
        coin={sourceCoin.toLowerCase()}
      />
      <ClickableText
        data-e2e='exchangeExchangeRadioText'
        onClick={() => {
          if (!sourceActive) swapFix()
        }}
        size='14px'
        weight={400}
      >
        <FormattedMessage
          id='scenes.exchange.exchangeform.swap'
          defaultMessage='Swap'
        />
      </ClickableText>
    </Cell>
    <SwapReceiveGap size='small' />
    <Cell>
      {
        <ActiveCurrencyButton
          data-e2e='exchangeReceiveRadioButton'
          onClick={() => {
            if (!targetActive) swapFix()
          }}
          checked={targetActive}
          coin={targetCoin.toLowerCase()}
        />
      }
      <ClickableText
        data-e2e='exchangeReceiveRadioText'
        onClick={() => {
          if (!targetActive) swapFix()
        }}
        size='14px'
        weight={400}
      >
        <FormattedMessage
          id='scenes.exchange.exchangeform.to'
          defaultMessage='Receive'
        />
      </ClickableText>
    </Cell>
  </SwapReceiveRow>
)

export default connect(getData)(SwapReceiveSwitch)
