import React from 'react'
import styled from 'styled-components'
import ReactHighcharts from 'react-highcharts'
import { FormattedMessage } from 'react-intl'
import { gt } from 'ramda'

import { Text } from 'blockchain-info-components'
import media from 'services/ResponsiveService'
import configure from './chart.config.js'
import BchBalance from './BchBalance'
import BtcBalance from './BtcBalance'
import EthBalance from './EthBalance'

const Wrapper = styled.div`
  width: 100%;
  height: 400px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  justify-content: space-between;
  border: 1px solid ${props => props.theme['gray-1']};
  svg {
    font-weight: 300;
    font-family: 'Montserrat' !important;
    .highcharts-background {
      fill: ${props => props.theme['white']} !important;
    }
    .highcharts-title {
      fill: ${props => props.theme['gray-5']} !important;
    }
    .highcharts-color-0 {
      fill: ${props =>
        gt(props.btcBalance, 0)
          ? props.theme['brand-primary']
          : props.theme['gray-2']} !important;
    }
    .highcharts-color-1 {
      fill: ${props => props.theme['brand-secondary']} !important;
    }
    .highcharts-color-2 {
      fill: ${props => props.theme['brand-tertiary']} !important;
    }
  }
  @media (min-width: 480px) {
    height: 380px;
  }
`
const ChartInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  ${media.mobile`
    > div:last-of-type {
      width: 28%;
    }
  `};
`
const Column = styled.div`
  display: flex;
  flex-direction: column;
  width: 25%;
  > * {
    margin-bottom: 4px;
  }
`

const BalancesChart = props => {
  const { balances, handleCoinDisplay, history } = props
  const { btcBalance, ethBalance, bchBalance, chartData, symbol } = balances

  return (
    <Wrapper className={'ignore-react-onclickoutside'} btcBalance={btcBalance}>
      <Text uppercase color='brand-primary' weight={300} size='24px'>
        <FormattedMessage
          id='scenes.home.balanceschart.yourbalances'
          defaultMessage='Your Balances'
        />
      </Text>
      <ReactHighcharts
        config={configure(chartData, symbol, history)}
        isPureConfig
      />
      <ChartInfo>
        <Column>
          <BtcBalance
            btcBalance={btcBalance}
            bchBalance={bchBalance}
            ethBalance={ethBalance}
            handleCoinDisplay={handleCoinDisplay}
          />
        </Column>
        <Column>
          <EthBalance
            btcBalance={btcBalance}
            bchBalance={bchBalance}
            ethBalance={ethBalance}
            handleCoinDisplay={handleCoinDisplay}
          />
        </Column>
        <Column>
          <BchBalance
            btcBalance={btcBalance}
            bchBalance={bchBalance}
            ethBalance={ethBalance}
            handleCoinDisplay={handleCoinDisplay}
          />
        </Column>
      </ChartInfo>
    </Wrapper>
  )
}

export default BalancesChart
