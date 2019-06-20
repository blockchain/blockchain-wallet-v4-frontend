import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { isNil, isEmpty } from 'ramda'

import * as C from 'services/AlertService'
import { actions } from 'data'
import MobileLogin from './template'

class MobileLoginContainer extends React.PureComponent {
  handleScan = result => {
    if (!isNil(result) && !isEmpty(result)) {
      this.props.authActions.mobileLogin(result)
    }
  }

  handleError = error => {
    if (isNil(error) && isEmpty(error)) {
      this.props.alertsActions.displayError(C.MOBILE_LOGIN_SCAN_ERROR)
    }
  }

  render () {
    return (
      <MobileLogin
        {...this.props}
        handleScan={this.handleScan}
        handleError={this.handleError}
      />
    )
  }
}

const mapDispatchToProps = dispatch => ({
  alertsActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  connect(
    undefined,
    mapDispatchToProps
  )
)

export default enhance(MobileLoginContainer)
