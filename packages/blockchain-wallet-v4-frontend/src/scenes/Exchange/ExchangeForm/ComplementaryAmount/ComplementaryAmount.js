import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getData } from './selectors'
import StringDisplay from 'components/Display/StringDisplay'

const ComplementaryAmountContaier = styled.div`
  font-weight: 200;
  font-size: 20px;
  line-height: 24px;
  position: relative;
  font-family: 'Montserrat', Helvetica, sans-serif;
  justify-self: center;
  margin: auto;
  margin-top: 10px;
`

export const formatAmount = (isFiat, symbol, value) =>
  isFiat ? `${symbol}${value}` : `${value} ${symbol}`

class ComplementaryAmount extends React.PureComponent {
  render () {
    const { complementaryAmount, fiatActive, complementarySymbol } = this.props
    return (
      <ComplementaryAmountContaier>
        <StringDisplay>
          {complementaryAmount.map(amount =>
            formatAmount(!fiatActive, complementarySymbol, amount)
          )}
        </StringDisplay>
      </ComplementaryAmountContaier>
    )
  }
}

export default connect(getData)(ComplementaryAmount)
