import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { bindActionCreators } from 'redux'

import { TimeRange } from '@core/types'
import { Tab, Tabs } from 'components/Tabs'
import { actions } from 'data'

import { UseTabs } from './types'

export const useTabs: UseTabs = ({ coin }) => {
  const dispatch = useDispatch()
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(TimeRange.WEEK)

  const priceChartActions = useMemo(
    () => bindActionCreators(actions.components.priceChart, dispatch),
    [dispatch]
  )

  const setTab = useCallback(
    (timeRange: TimeRange) => {
      setSelectedTimeRange(timeRange)

      priceChartActions.initialized(coin, timeRange)
    },
    [priceChartActions, coin, setSelectedTimeRange]
  )

  const tabsNode = useMemo(
    () => (
      <Tabs>
        <Tab onClick={() => setTab(TimeRange.DAY)} selected={selectedTimeRange === TimeRange.DAY}>
          <FormattedMessage id='coinPage.tabs.1_day' defaultMessage='1D' />
        </Tab>

        <Tab onClick={() => setTab(TimeRange.WEEK)} selected={selectedTimeRange === TimeRange.WEEK}>
          <FormattedMessage id='coinPage.tabs.1_week' defaultMessage='1W' />
        </Tab>

        <Tab
          onClick={() => setTab(TimeRange.MONTH)}
          selected={selectedTimeRange === TimeRange.MONTH}
        >
          <FormattedMessage id='coinPage.tabs.1_month' defaultMessage='1M' />
        </Tab>

        <Tab onClick={() => setTab(TimeRange.YEAR)} selected={selectedTimeRange === TimeRange.YEAR}>
          <FormattedMessage id='coinPage.tabs.1_year' defaultMessage='1Y' />
        </Tab>

        <Tab onClick={() => setTab(TimeRange.ALL)} selected={selectedTimeRange === TimeRange.ALL}>
          <FormattedMessage id='coinPage.tabs.all' defaultMessage='All' />
        </Tab>
      </Tabs>
    ),
    [setTab, selectedTimeRange]
  )

  useEffect(() => {
    priceChartActions.initialized(coin, TimeRange.WEEK)
  }, [coin, priceChartActions])

  return [
    tabsNode,
    {
      selectedTimeRange
    }
  ]
}
