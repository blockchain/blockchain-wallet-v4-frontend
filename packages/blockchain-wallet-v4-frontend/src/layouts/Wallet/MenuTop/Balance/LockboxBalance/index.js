import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getData } from './selectors'
import { actions } from 'data'
import { prop } from 'ramda'
import Template from './template'
const key = 'lockbox'

class LockboxBalanceContainer extends React.PureComponent {
  render () {
    const { data, preferencesActions } = this.props
    const { totalBalancesDropdown, lockboxEnabled } = data
    const isActive = prop(key, totalBalancesDropdown)
    return lockboxEnabled ? (
      <Template
        isActive={isActive}
        handleToggle={() =>
          preferencesActions.setTotalBalancesDropdown({
            key,
            val: !isActive
          })
        }
      />
    ) : null
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LockboxBalanceContainer)
