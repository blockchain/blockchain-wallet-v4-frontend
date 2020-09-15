import * as C from 'services/AlertService'
import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { isEmpty, isNil } from 'ramda'
import MobileLogin from './template'
import React from 'react'

class MobileLoginContainer extends React.PureComponent<Props> {
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

const connector = connect(undefined, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(MobileLoginContainer)
