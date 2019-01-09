import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import Chart from './Chart'
import CoinFilters from './CoinFilters'
import TimeFilters from './TimeFilters'
import media from 'services/ResponsiveService'
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 390px;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-1']};
  & > * {
    margin-bottom: 10px;
  }
`
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const TitleRow = styled(Row)`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`
const TitleText = styled(Text)`
  font-weight: 300;
  font-size: 24px;
  margin: 0;
  ${media.mobile`
    font-size: 22px;
    margin-bottom: 10px;
  `};
`
const PriceChart = () => (
  <Wrapper>
    <TitleRow>
      <TitleText color='brand-primary' uppercase>
        <FormattedMessage
          id='scenes.home.pricechart'
          defaultMessage='Price chart'
        />
      </TitleText>
      <TimeFilters />
    </TitleRow>
    <Row>
      <Chart />
    </Row>
    <Row>
      <CoinFilters />
    </Row>
  </Wrapper>
)

export default PriceChart
