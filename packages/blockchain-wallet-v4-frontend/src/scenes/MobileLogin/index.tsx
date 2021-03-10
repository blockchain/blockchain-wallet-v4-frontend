import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { isEmpty, isNil } from 'ramda'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import * as C from 'services/alerts'

import MobileLogin from './template'

const MobileLoginContainer = (props: Props) => {
  const handleScan = result => {
    if (!isNil(result) && !isEmpty(result)) {
      props.authActions.mobileLogin(result)
    }
  }

  const handleError = error => {
    if (isNil(error) && isEmpty(error)) {
      props.alertsActions.displayError(C.MOBILE_LOGIN_SCAN_ERROR)
    }
  }

  return (
    <MobileLogin
      {...props}
      handleScan={handleScan}
      handleError={handleError}
      isScanning={props.logginStarted}
    />
  )
}

const mapStateToProps = state => ({
  logginStarted: selectors.auth.getMobileLoginStarted(state)
})

const mapDispatchToProps = dispatch => ({
  alertsActions: bindActionCreators(actions.alerts, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(MobileLoginContainer)
