import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { TabMenu, TabMenuItem } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

const CustomTabMenu = styled(TabMenu)`
  margin-bottom: 24px;
`

type OwnProps = {
  currentTab: 'total' | 'wallet' | 'lockbox'
}

type LinkDispatchPropsType = {
  layoutActions: typeof actions.components.layoutWallet
}

type Props = OwnProps & LinkDispatchPropsType

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
          <FormattedMessage
            id='scenes.home.balance.total'
            defaultMessage='Total'
          />
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

export default connect(
  null,
  mapDispatchToProps
)(TabsContainer)
