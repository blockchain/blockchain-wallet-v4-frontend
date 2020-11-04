import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'
import Template from './template'

class VerifyEmail extends PureComponent<Props> {
  state = {}

  static getDerivedStateFromProps (nextProps) {
    if (nextProps.isEmailVerified) {
      nextProps.simpleBuyActions.setStep({
        step: 'ENTER_AMOUNT',
        orderType: nextProps.orderType,
        cryptoCurrency: nextProps.cryptoCurrency,
        fiatCurrency: nextProps.fiatCurrency,
        pair: nextProps.pair
      })
    }
    return null
  }

  onResendEmail = () => {
    const { securityCenterActions, email } = this.props
    securityCenterActions.resendVerifyEmail(email)
  }

  render () {
    return <Template {...this.props} resendEmail={this.onResendEmail} />
  }
}

const mapStateToProps = (state: RootState) => ({
  email: selectors.auth.getRegisterEmail(state),
  isEmailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(false)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  securityCenterActions: bindActionCreators(
    actions.modules.securityCenter,
    dispatch
  )
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>
export type LinkDispatchPropsType = ReturnType<typeof mapDispatchToProps>
export default connector(VerifyEmail)
