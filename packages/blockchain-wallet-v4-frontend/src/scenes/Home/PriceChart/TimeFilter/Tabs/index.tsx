import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { TimeRange } from '@core/types'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'
import { actions } from 'data'
import { media } from 'services/styles'

const CustomTabMenu = styled(TabMenu)`
  margin: 0 24px;
  ${media.atLeastTabletL`
    margin-right: 24px;
    margin-bottom: 24px;
  `}
`

const TabsContainer = ({ currentTab, handleClick }: OwnProps) => {
  return (
    <CustomTabMenu>
      <TabMenuItem
        width='20%'
        data-e2e='dayTab'
        selected={currentTab === TimeRange.DAY}
        onClick={() => handleClick(TimeRange.DAY)}
      >
        <FormattedMessage id='copy.day' defaultMessage='1D' />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='weekTab'
        selected={currentTab === TimeRange.WEEK}
        onClick={() => handleClick(TimeRange.WEEK)}
      >
        <FormattedMessage id='copy.week' defaultMessage='1W' />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='monthTab'
        selected={currentTab === TimeRange.MONTH}
        onClick={() => handleClick(TimeRange.MONTH)}
      >
        <FormattedMessage id='copy.month' defaultMessage='1M' />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='yearTab'
        selected={currentTab === TimeRange.YEAR}
        onClick={() => handleClick(TimeRange.YEAR)}
      >
        <FormattedMessage id='copy.year' defaultMessage='1Y' />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='allTab'
        selected={currentTab === TimeRange.ALL}
        onClick={() => handleClick(TimeRange.ALL)}
      >
        <FormattedMessage id='copy.all' defaultMessage='All' />
      </TabMenuItem>
    </CustomTabMenu>
  )
}

export const mapDispatchToProps = (dispatch) => ({
  layoutActions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  currentTab: TimeRange
  handleClick: (time: TimeRange) => void
}

export default connector(TabsContainer)
