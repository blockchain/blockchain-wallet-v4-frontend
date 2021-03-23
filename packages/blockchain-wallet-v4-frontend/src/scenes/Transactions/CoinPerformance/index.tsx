import React from 'react'
import styled from 'styled-components'

import { media } from 'services/styles'

import CoinChart from './CoinChart'
import CoinPrices from './CoinPrices'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${props => props.theme.grey100};
  box-sizing: border-box;
  border-radius: 8px;
  padding: 16px;
  width: 100%;
  height: 100%;

  ${media.tablet`
    align-items: initial;
    flex-direction: column;
  `}
`

const ColumnLeft = styled.div`
  margin-right: 16px;
  height: 100%;
`

const ColumnRight = styled.div`
  width: 100%;
  margin: 16px 0;
`

const CoinPerformanceContainer = ({ coin, coinModel }) => (
  <Wrapper>
    <ColumnLeft>
      <CoinPrices coinModel={coinModel} />
    </ColumnLeft>
    <ColumnRight>
      <CoinChart coin={coin} />
    </ColumnRight>
  </Wrapper>
)

export default CoinPerformanceContainer
