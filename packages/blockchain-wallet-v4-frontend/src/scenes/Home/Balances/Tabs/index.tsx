import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { actions } from 'data'

const CustomTabMenu = styled(TabMenu)`
  margin-bottom: 24px;
`

class TabsContainer extends React.PureComponent<Props> {
  handleClick = tab => {
    this.props.layoutActions.setBalancesTableTab(tab)
  }

  render () {
    const { currentTab } = this.props
    return (
      <CustomTabMenu>
        <TabMenuItem
          width='33%'
          data-e2e='totalTab'
          selected={currentTab === 'total'}
          onClick={() => this.handleClick('total')}
        >
          <FormattedMessage id='copy.total' defaultMessage='Total' />
        </TabMenuItem>
        <TabMenuItem
          width='33%'
          data-e2e='walletTab'
          selected={currentTab === 'wallet'}
          onClick={() => this.handleClick('wallet')}
        >
          <FormattedMessage
            id='scenes.home.balance.wallet'
            defaultMessage='Wallet'
          />
        </TabMenuItem>
        <TabMenuItem
          width='33%'
          data-e2e='lockboxTab'
          selected={currentTab === 'lockbox'}
          onClick={() => this.handleClick('lockbox')}
        >
          <FormattedMessage
            id='scenes.home.balance.hardware'
            defaultMessage='Hardware'
          />
        </TabMenuItem>
      </CustomTabMenu>
    )
  }
}

export const mapDispatchToProps = dispatch => ({
  layoutActions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  currentTab: 'total' | 'wallet' | 'lockbox'
}
type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(TabsContainer)
