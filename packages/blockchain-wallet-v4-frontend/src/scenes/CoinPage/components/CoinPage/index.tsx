import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'

import { Exchange } from '@core'
import { fiatToString } from '@core/exchange/utils'
import { CoinType, OrderType, TimeRange } from '@core/types'
import { Tab, Tabs } from 'components/Tabs'
import { actions } from 'data'
import { ModalName } from 'data/types'

import { CoinHeader } from '..'
import { AboutSection } from '../AboutSection'
import { ChartBalancePanel } from '../ChartBalancePanel'
import { HoldingsCard } from '../HoldingsCard'
import { CoinPage } from './CoinPage'
import { useChart } from './hooks'
import { HoldingsCardActions } from './model'
import { getData } from './selectors'
import { CoinPageContainerComponent } from './types'

export type { CoinPageComponent, CoinPageProps } from './types'

const CoinPageContainer: CoinPageContainerComponent<Props> = memo(
  ({
    buyButtonHandler,
    coin,
    currency,
    data,
    priceChartActions,
    receiveButtonHandler,
    sellButtonHandler,
    sendButtonHandler
  }) => {
    const [selectedTab, setSelectedTab] = useState<TimeRange>(TimeRange.WEEK)
    const [chart] = useChart()

    useEffect(() => {
      priceChartActions.initialized(coin, TimeRange.WEEK)
    }, [coin, priceChartActions])

    const { coinfig } = useMemo(() => window.coins[coin], [coin])
    const displayName = useMemo(() => coinfig.name, [coinfig.name])

    const buyButtonCallback = useCallback(() => buyButtonHandler(coin), [buyButtonHandler, coin])
    const sellButtonCallback = useCallback(() => sellButtonHandler(coin), [sellButtonHandler, coin])
    const sendButtonCallback = useCallback(() => sendButtonHandler(coin), [sendButtonHandler, coin])
    const receiveButtonCallback = useCallback(
      () => receiveButtonHandler(coin),
      [receiveButtonHandler, coin]
    )
    const handleTabChange = useCallback(
      (timeRange: TimeRange) => {
        setSelectedTab(timeRange)
        priceChartActions.initialized(coin, timeRange)
      },
      [coin, priceChartActions]
    )

    return data.cata({
      Failure: () => <>Failure</>,
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
        const coinTotalAmount = Exchange.displayCoinToCoin({
          coin,
          isFiat: coinfig.type.name === 'FIAT',
          value: balanceData
        })

        const holdingsCardActions = HoldingsCardActions({
          amount: Number(coinTotalAmount),
          buyButtonCallback,
          products,
          receiveButtonCallback,
          sellButtonCallback,
          sendButtonCallback
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
            chart={chart}
            header={<CoinHeader coinCode={coin} coinDescription='' coinName={displayName} />}
            chartBalancePanel={
              <ChartBalancePanel
                coinCode={coin}
                pastHourDelta={value.priceChange.overallChange.percentChange}
                pastHourPrice={value.priceChange.overallChange.diff}
                price={value.priceChange.currentPrice}
              />
            }
            // alertCard={<AlertCard content='' />}
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
  buyButtonHandler: (coin: CoinType) => {
    dispatch(
      actions.components.buySell.showModal({
        cryptoCurrency: coin,
        orderType: OrderType.BUY,
        origin: 'CoinPageHoldings'
      })
    )
  },
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  priceChartActions: bindActionCreators(actions.components.priceChart, dispatch),
  receiveButtonHandler: (coin: CoinType) => {
    dispatch(
      actions.modals.showModal(ModalName.REQUEST_CRYPTO_MODAL, {
        origin: 'CoinPageHoldings',
        preselectedCoin: coin
      })
    )
  },
  sellButtonHandler: (coin: CoinType) => {
    dispatch(
      actions.components.buySell.showModal({
        cryptoCurrency: coin,
        orderType: OrderType.SELL,
        origin: 'CoinPageHoldings'
      })
    )
  },
  sendButtonHandler: (coin: CoinType) => {
    dispatch(
      actions.modals.showModal(ModalName.SEND_CRYPTO_MODAL, {
        coin,
        origin: 'CoinPageHoldings'
      })
    )
  }
})
const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinPageContainer)
