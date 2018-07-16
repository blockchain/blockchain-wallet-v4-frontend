import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals, prop } from 'ramda'

import { getData } from './selectors'
import Success from './template'

class KYCNotificationContainer extends React.Component {
  componentWillUnmount () {
    const { kyc, showKycCompleted } = this.props

    if (showKycCompleted && equals(prop('state', kyc), 'completed')) {
      this.props.preferencesActions.hideKycCompleted()
    }
  }

  render () {
    const { canTrade, kyc, limits, onTrigger, showKycCompleted, symbol, type } = this.props

    return (showKycCompleted || !equals(prop('state', kyc), 'completed'))
      ? <Success kyc={kyc} canTrade={canTrade} limits={limits} onTrigger={onTrigger}
        showKycCompleted={showKycCompleted} symbol={symbol} type={type} />
      : null
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  preferencesActions: bindActionCreators(actions.preferences, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(KYCNotificationContainer)
