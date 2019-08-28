import React from 'react'
import { actions, model } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals } from 'ramda'

import { getData } from './selectors'
import Success from './template'

const { VERIFIED } = model.profile.KYC_STATES

class KYCNotificationContainer extends React.PureComponent {
  componentWillUnmount () {
    const { showKycCompleted, kycState } = this.props

    if (showKycCompleted && equals(kycState, VERIFIED)) {
      this.props.preferencesActions.hideKycCompleted()
    }
  }

  render () {
    const { canTrade, limits, onTrigger, symbol, type, kycState } = this.props
    return (
      <Success
        canTrade={canTrade}
        limits={limits}
        onTrigger={onTrigger}
        symbol={symbol}
        type={type}
        kycState={kycState}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(KYCNotificationContainer)
