import React from 'react'
import Template from './template'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { bindActionCreators } from 'redux'
import { actions, selectors } from 'data'
import { gt, prop } from 'ramda'

const key = 'pending'

class PendingBalanceContainer extends React.PureComponent {
  render () {
    const {
      preferencesActions,
      totalBalancesDropdown,
      sfoxPendingBalance
    } = this.props
    const totalPendingBalance = sfoxPendingBalance.getOrElse(0)
    const isActive = prop(key, totalBalancesDropdown)
    return (
      gt(totalPendingBalance, 0) && (
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
  sfoxPendingBalance: getData(state),
  totalBalancesDropdown: selectors.preferences.getTotalBalancesDropdown(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingBalanceContainer)
