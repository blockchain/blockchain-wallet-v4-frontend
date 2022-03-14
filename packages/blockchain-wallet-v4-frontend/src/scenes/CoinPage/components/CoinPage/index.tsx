import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { colors } from '@blockchain-com/constellation'
import { bindActionCreators } from '@reduxjs/toolkit'

import { Exchange } from '@core'
import { fiatToString } from '@core/exchange/utils'
import { CoinType, TimeRange } from '@core/types'
import { Tab, Tabs } from 'components/Tabs'
import { actions } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'

import { CoinHeader } from '..'
import { AboutSection } from '../AboutSection'
import { AlertCard } from '../AlertCard'
import { ChartBalancePanel } from '../ChartBalancePanel'
import { CoinChart } from '../CoinChart'
import { HoldingsCard } from '../HoldingsCard'
import { CoinPage } from './CoinPage'
import { HoldingsCardActions } from './model'
import { getData } from './selectors'
import { CoinPageContainerComponent } from './types'
import { createDateFormatterFromSelectedTimeRange } from './utils/createChartDateFormatterFromSelectedTimeRange'
import { transformChartData } from './utils/transformChartData'

export type { CoinPageComponent, CoinPageProps } from './types'

const CoinPageContainer: CoinPageContainerComponent<Props> = memo(
  ({ coin, currency, data, priceChartActions }) => {
    const { coinfig } = useMemo(() => window.coins[coin], [coin])
    const displayName = useMemo(() => coinfig.name, [coin])
    const [selectedTab, setSelectedTab] = useState<TimeRange>(TimeRange.DAY)

    useEffect(() => {
      priceChartActions.initialized(coin, TimeRange.WEEK)
    }, [coin, priceChartActions])

    const handleTabChange = useCallback(
      (timeRange: TimeRange) => {
        setSelectedTab(timeRange)
        priceChartActions.initialized(coin, timeRange)
      },
      [coin, priceChartActions]
    )

    return data.cata({
      Failure: () => <></>,
      Loading: () => <>Loading...</>,
      NotAsked: () => <>Not Asked</>,
      Success: (value) => {
        const { balanceData, rates } = value
        const { products } = coinfig
        const totalFiatAmount = Exchange.convertCoinToFiat({
          coin,
          currency,
          isStandard: false,
          rates,
          value: balanceData
        })
        const totalFiatFormatted = fiatToString({ unit: currency, value: totalFiatAmount })
        const coinTotalAmount = convertBaseToStandard(coin, balanceData)
        const holdingsCardActions = HoldingsCardActions({
          amount: Number(coinTotalAmount),
          products
        })

        return (
          <CoinPage
            chartTabs={
              <Tabs>
                <Tab
                  onClick={() => handleTabChange(TimeRange.DAY)}
                  selected={selectedTab === TimeRange.DAY}
                >
                  1D
                </Tab>

                <Tab
                  onClick={() => handleTabChange(TimeRange.WEEK)}
                  selected={selectedTab === TimeRange.WEEK}
                >
                  1W
                </Tab>

                <Tab
                  onClick={() => handleTabChange(TimeRange.MONTH)}
                  selected={selectedTab === TimeRange.MONTH}
                >
                  1M
                </Tab>

                <Tab
                  onClick={() => handleTabChange(TimeRange.YEAR)}
                  selected={selectedTab === TimeRange.YEAR}
                >
                  1Y
                </Tab>

                <Tab
                  onClick={() => handleTabChange(TimeRange.ALL)}
                  selected={selectedTab === TimeRange.ALL}
                >
                  All
                </Tab>
              </Tabs>
            }
            about={<AboutSection content='' title={coin} actions={[<></>]} />}
            chart={
              <CoinChart
                data={transformChartData(value.data)}
                backgroundColor={colors.white060}
                primaryColor={colors.blue600}
                textColor={colors.grey400}
                x='date'
                y='value'
                xFormatter={createDateFormatterFromSelectedTimeRange(selectedTab)}
                numTicks={6}
              />
            }
            header={<CoinHeader coinCode={coin} coinDescription='' coinName={displayName} />}
            chartBalancePanel={
              <ChartBalancePanel
                coinCode={coin}
                pastHourDelta={value.priceChange.overallChange.percentChange}
                pastHourPrice={value.priceChange.overallChange.diff}
                price={value.priceChange.currentPrice}
              />
            }
            // alertCard={<AlertCard content='' title='' />}
            holdings={
              <HoldingsCard
                actions={holdingsCardActions}
                total={totalFiatFormatted}
                coinCode={coin}
                coinTotal={coinTotalAmount}
              />
            }
          />
        )
      }
    })
  }
)

const mapStateToProps = (state, ownProps) => getData(state, ownProps)
const mapDispatchToProps = (dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  priceChartActions: bindActionCreators(actions.components.priceChart, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinPageContainer)
