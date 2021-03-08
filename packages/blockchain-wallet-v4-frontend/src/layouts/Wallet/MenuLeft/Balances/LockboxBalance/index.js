import React from 'react'
import { connect } from 'react-redux'
import { prop } from 'ramda'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import Template from './template'
const key = 'lockbox'

class LockboxBalanceContainer extends React.PureComponent {
  render () {
    const { data, preferencesActions } = this.props
    const { totalBalancesDropdown } = data
    const isActive = prop(key, totalBalancesDropdown)
    return (
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
