import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { getData } from './selectors'
import { formatAmount } from '../services'
import StringDisplay from 'components/Display/StringDisplay'

const ComplementaryAmountContainer = styled.div`
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  justify-self: center;
  margin-top: 10px;
`

export class ComplementaryAmount extends React.PureComponent {
  render () {
    const { complementaryAmount, isFiat, complementarySymbol } = this.props
    return (
      <ComplementaryAmountContainer>
        <StringDisplay
          data-e2e='exchangeComplementaryAmount'
          skeletonHeight='24px'
        >
          {complementaryAmount.map(amount =>
            formatAmount(isFiat, complementarySymbol, amount)
          )}
        </StringDisplay>
      </ComplementaryAmountContainer>
    )
  }
}

export default connect(getData)(ComplementaryAmount)
