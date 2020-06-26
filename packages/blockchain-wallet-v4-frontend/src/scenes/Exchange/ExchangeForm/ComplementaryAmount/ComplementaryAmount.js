import { connect } from 'react-redux'
import { formatAmount } from '../services'
import { getData } from './selectors'
import React from 'react'
import StringDisplay from 'components/Display/StringDisplay'
import styled from 'styled-components'

const ComplementaryAmountContainer = styled.div`
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  position: relative;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  justify-self: center;
  margin-top: 10px;
  color: ${props => props.theme.textBlack};
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
