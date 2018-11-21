import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'
import { actions } from 'data'

const Tabs = styled.div`
  display: flex;
  border-bottom: 2px solid ${props => props.theme['gray-1']};
`
const Tab = styled.div`
  width: 33%;
  display: flex;
  padding: 10px 5px;
  position: relative;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media (min-width: 768px) {
    padding: 15px 5px;
  }
  &:after {
    display: block;
    content: '';
    width: 100%;
    left: 0;
    bottom: -2px;
    position: absolute;
    transform: scaleX(0);
    transition: transform 0.3s;
    border-bottom: solid 2px ${props => props.theme['gray-6']};
  }
  > * {
    color: ${props => props.theme['gray-2']};
    transition: color 0.3s;
  }
  &.active,
  &:hover {
    &:after {
      transform: scaleX(1);
    }
    > * {
      color: ${props => props.theme['gray-6']};
    }
  }
`
const TabHeader = styled(Text)`
  font-weight: 300;
  @media (min-width: 768px) {
    font-size: 20px;
  }
`
const TabIcon = styled(Icon)`
  margin-right: 10px;
  @media (min-width: 768px) {
    font-size: ${props => props.size || '20px'};
  }
`

class TabsContainer extends React.PureComponent {
  handleClick = tab => {
    this.props.layoutActions.setBalancesTableTab(tab)
  }

  render () {
    const { currentTab } = this.props
    return (
      <Tabs>
        <Tab
          className={currentTab === 'total' ? 'active' : ''}
          onClick={() => this.handleClick('total')}
        >
          <TabIcon name='bank-filled' />
          <TabHeader data-e2e='totalTab'>
            <FormattedMessage
              id='scenes.home.balance.total'
              defaultMessage='Total'
            />
          </TabHeader>
        </Tab>
        <Tab
          className={currentTab === 'wallet' ? 'active' : ''}
          onClick={() => this.handleClick('wallet')}
        >
          <TabIcon name='wallet' />
          <TabHeader data-e2e='walletTab'>
            <FormattedMessage
              id='scenes.home.balance.wallet'
              defaultMessage='Wallet'
            />
          </TabHeader>
        </Tab>
        <Tab
          className={currentTab === 'lockbox' ? 'active' : ''}
          onClick={() => this.handleClick('lockbox')}
        >
          <TabIcon name='lock' size='28px' />
          <TabHeader data-e2e='lockboxTab'>
            <FormattedMessage
              id='scenes.home.balance.lockbox'
              defaultMessage='Lockbox'
            />
          </TabHeader>
        </Tab>
      </Tabs>
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
