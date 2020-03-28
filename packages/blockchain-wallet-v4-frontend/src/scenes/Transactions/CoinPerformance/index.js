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
  box-sizing: border-box;
  border-radius: 8px;
  padding: 14px 15px;
  width: 100%;

  ${media.tablet`
    align-items: initial;
    flex-direction: column;
  `}
`

const CoinPerformanceContainer = ({ coin, coinModel }) => (
  <Wrapper>
    <CoinPrices coin={coin} coinModel={coinModel} />
    <CoinChart coin={coin} />
  </Wrapper>
)

CoinPerformanceContainer.propTypes = {
  coin: PropTypes.string.isRequired
}

export default CoinPerformanceContainer
