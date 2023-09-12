import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { TimeRange } from '@core/types'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'
import { timeClicked } from 'data/components/priceChart/slice'
import { media } from 'services/styles'

import { getData } from './selectors'

const CustomTabMenu = styled(TabMenu)`
  margin: 0 24px;
  ${media.atLeastTabletL`
    margin-right: 24px;
    margin-bottom: 24px;
  `}
`

const TimeFilter = () => {
  const dispatch = useDispatch()
  const { time } = useSelector(getData)

  useEffect(() => {
    dispatch(timeClicked(TimeRange.DAY))
  }, [])

  const handleClick = (time: TimeRange) => {
    dispatch(timeClicked(time))
  }

  return (
    <CustomTabMenu>
      <TabMenuItem
        width='20%'
        data-e2e='dayTab'
        selected={time === TimeRange.DAY}
        onClick={() => handleClick(TimeRange.DAY)}
      >
        <FormattedMessage id='copy.day' defaultMessage='1D' />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='weekTab'
        selected={time === TimeRange.WEEK}
        onClick={() => handleClick(TimeRange.WEEK)}
      >
        <FormattedMessage id='copy.week' defaultMessage='1W' />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='monthTab'
        selected={time === TimeRange.MONTH}
        onClick={() => handleClick(TimeRange.MONTH)}
      >
        <FormattedMessage id='copy.month' defaultMessage='1M' />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='yearTab'
        selected={time === TimeRange.YEAR}
        onClick={() => handleClick(TimeRange.YEAR)}
      >
        <FormattedMessage id='copy.year' defaultMessage='1Y' />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='allTab'
        selected={time === TimeRange.ALL}
        onClick={() => handleClick(TimeRange.ALL)}
      >
        <FormattedMessage id='copy.all' defaultMessage='All' />
      </TabMenuItem>
    </CustomTabMenu>
  )
}

export default TimeFilter
