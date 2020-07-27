import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { prop } from 'ramda'
import React from 'react'

import { actions, selectors } from 'data'

import Template from './template'

class WalletBalanceContainer extends React.PureComponent<Props> {
  render () {
    const { preferencesActions, totalBalancesDropdown, coins } = this.props
    // @ts-ignore
    const isActive = prop('wallet', totalBalancesDropdown)
    return (
      <Template
        isActive={isActive}
        coins={coins}
        handleToggle={() =>
          preferencesActions.setTotalBalancesDropdown({
            key: 'wallet',
            val: !isActive
          })
        }
      />
    )
  }
}

const mapStateToProps = state => ({
  totalBalancesDropdown: selectors.preferences.getTotalBalancesDropdown(state),
  coins: selectors.components.utils
    .getSupportedCoinsWithBalanceAndOrder(state)
    // @ts-ignore
    .getOrElse({})
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(WalletBalanceContainer)
