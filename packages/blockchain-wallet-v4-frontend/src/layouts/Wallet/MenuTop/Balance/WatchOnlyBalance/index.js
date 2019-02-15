import React from 'react'
import { gt, prop } from 'ramda'
import Template from './template'
import { connect } from 'react-redux'
import { actions, selectors } from 'data'
import { bindActionCreators } from 'redux'
import { getBtcWatchOnlyBalance, getBchWatchOnlyBalance } from './selectors'

const key = 'watchOnly'

class Balance extends React.PureComponent {
  render () {
    const {
      btcWatchOnlyBalance,
      bchWatchOnlyBalance,
      preferencesActions,
      totalBalancesDropdown
    } = this.props
    const totalWatchOnlyBalance =
      btcWatchOnlyBalance.getOrElse(0) + bchWatchOnlyBalance.getOrElse(0)
    const isActive = prop(key, totalBalancesDropdown)
    return (
      gt(totalWatchOnlyBalance, 0) && (
        <Template
          isActive={isActive}
          handleToggle={() =>
            preferencesActions.setTotalBalancesDropdown({
              key,
              val: !isActive
            })
          }
        />
      )
    )
  }
}

const mapStateToProps = state => ({
  btcWatchOnlyBalance: getBtcWatchOnlyBalance(state),
  bchWatchOnlyBalance: getBchWatchOnlyBalance(state),
  totalBalancesDropdown: selectors.preferences.getTotalBalancesDropdown(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Balance)
