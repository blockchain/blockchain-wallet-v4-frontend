import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

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

const TabsContainer = ({
  currentTab,
  handleClick
}: {
  currentTab: string
  handleClick: (time: 'day' | 'week' | 'month' | 'year' | 'all') => void
}) => {
  return (
    <CustomTabMenu>
      <TabMenuItem
        width='20%'
        data-e2e='dayTab'
        selected={currentTab === 'day'}
        onClick={() => handleClick('day')}
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.day'
          defaultMessage='1D'
        />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='weekTab'
        selected={currentTab === 'week'}
        onClick={() => handleClick('week')}
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.week'
          defaultMessage='1W'
        />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='monthTab'
        selected={currentTab === 'month'}
        onClick={() => handleClick('month')}
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.month'
          defaultMessage='1M'
        />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='yearTab'
        selected={currentTab === 'year'}
        onClick={() => handleClick('year')}
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.year'
          defaultMessage='1Y'
        />
      </TabMenuItem>
      <TabMenuItem
        width='20%'
        data-e2e='allTab'
        selected={currentTab === 'all'}
        onClick={() => handleClick('all')}
      >
        <FormattedMessage
          id='scenes.priceindexseries.timefilters.all'
          defaultMessage='All'
        />
      </TabMenuItem>
    </CustomTabMenu>
  )
}

export const mapDispatchToProps = dispatch => ({
  layoutActions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  currentTab: 'day' | 'week' | 'month' | 'year' | 'all'
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TabsContainer)
