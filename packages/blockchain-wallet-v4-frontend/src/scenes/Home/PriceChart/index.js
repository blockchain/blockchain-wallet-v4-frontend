import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import Chart from './Chart'
import CoinFilters from './CoinFilters'
import TimeFilters from './TimeFilters'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 380px;
  padding: 15px;
  box-sizing: border-box;
  border: 1px solid ${props => props.theme['gray-1']};
  & > * { margin-bottom: 10px; }
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
  flex-direction: column;
  @media (min-width: 480px) {flex-direction: row;}
`
const TitleText = styled(Text)`
  font-size: 22px;
  margin-bottom: 10px;
  font-weight: 300;
  @media (min-width: 480px) {font-size: 24px; margin: 0;}
`
const PriceChart = () => (
  <Wrapper>
    <TitleRow>
      <TitleText color='brand-primary' uppercase>
        <FormattedMessage id='scenes.home.pricechart' defaultMessage='Price chart' />
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
