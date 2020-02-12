import CoinChart from './CoinChart'
import CoinPrices from './CoinPrices'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-content: space-between;
  border: 1px solid ${props => props.theme.grey100};
  border-radius: 8px;

  & > :first-child {
    flex-basis: 45%;
    padding: 14px 20px;
    margin-right: 35px;
  }

  & > :last-child {
    flex-basis: 55%;
    padding-right: 20px;
  }
`

const CoinPerformanceContainer = ({ coin }) => (
  <Wrapper>
    <CoinPrices coin={coin} />
    <CoinChart coin={coin} />
  </Wrapper>
)

CoinPerformanceContainer.propTypes = {
  coin: PropTypes.string.isRequired
}

export default CoinPerformanceContainer
