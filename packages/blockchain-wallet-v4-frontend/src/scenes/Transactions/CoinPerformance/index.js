import CoinChart from './CoinChart'
import CoinPrices from './CoinPrices'
import media from 'services/ResponsiveService'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${props => props.theme.grey100};
  border-radius: 8px;
  padding: 14px 20px;

  & > :last-child {
    margin-left: 100px;
    width: 100%;
    ${media.mobile`
      margin-left: 0px;
    `}
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
