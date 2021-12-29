import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import ProductPicker from './template'

class ProductPickerContainer extends React.PureComponent<Props> {
  // to avoid react dev errors, set an initial state since we are using
  // getDerivedStateFromProps which will set a state from the component
  constructor(props) {
    super(props)
    this.state = {}
  }

  walletRedirect = () => {
    this.props.routerActions.push('/home')
    // for first time login users we need to run goal since this is a first page we show them
    this.props.saveGoal('welcomeModal', { firstLogin: true })
    this.props.runGoals()
  }

  exchangeRedirect = () => {
    // TODO: this is a placeholder
  }

  render() {
    return (
      <ProductPicker
        {...this.props}
        walletRedirect={this.walletRedirect}
        exchangeRedirect={this.exchangeRedirect}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  appEnv: selectors.core.walletOptions.getAppEnv(state).getOrElse('prod'),
  email: selectors.auth.getRegisterEmail(state) as string,
  isEmailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(false)
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  miscActions: bindActionCreators(actions.core.data.misc, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  runGoals: () => dispatch(actions.goals.runGoals()),
  saveGoal: (name, data) => dispatch(actions.goals.saveGoal({ data, name })),
  securityCenterActions: bindActionCreators(actions.modules.securityCenter, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(ProductPickerContainer)
