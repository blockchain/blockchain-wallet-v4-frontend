import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { RemoteDataType } from '@core/types'
import { SpinningLoader } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { ExchangeAuthOriginType } from 'data/types'

import ProductPicker from './template'
import Error from './template.error'
import ExchangeUserConflict from './template.error.exchange'

class ProductPickerContainer extends React.PureComponent<Props> {
  // to avoid react dev errors, set an initial state since we are using
  // getDerivedStateFromProps which will set a state from the component
  constructor(props) {
    super(props)
    this.state = {}
  }

  walletRedirect = () => {
    this.props.signupActions.setRegisterEmail(undefined)
    this.props.routerActions.push('/home')
    // for first time login users we need to run goal since this is a first page we show them
    this.props.saveGoal('welcomeModal', { firstLogin: true })
    this.props.runGoals()
  }

  exchangeRedirect = () => {
    this.props.signupActions.setRegisterEmail(undefined)
    this.props.profileActions.getExchangeLoginToken(ExchangeAuthOriginType.Signup)
    // TODO: this is a placeholder
  }

  render() {
    return this.props.walletLoginData.cata({
      // TODO add proper error state
      Failure: (error) => <Error error={error} />,
      Loading: () => <SpinningLoader />,
      NotAsked: () => <Error />,
      Success: () =>
        this.props.exchangeUserConflict ? (
          <ExchangeUserConflict {...this.props} walletRedirect={this.walletRedirect} />
        ) : (
          <ProductPicker
            {...this.props}
            walletRedirect={this.walletRedirect}
            exchangeRedirect={this.exchangeRedirect}
          />
        )
    })
  }
}

const mapStateToProps = (state) => ({
  appEnv: selectors.core.walletOptions.getAppEnv(state).getOrElse('prod'),
  email: selectors.auth.getRegisterEmail(state) as string,
  exchangeUserConflict: selectors.auth.getExchangeConflictStatus(state) as boolean,
  walletLoginData: selectors.auth.getLogin(state) as RemoteDataType<any, any>
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  miscActions: bindActionCreators(actions.core.data.misc, dispatch),
  profileActions: bindActionCreators(actions.modules.profile, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  runGoals: () => dispatch(actions.goals.runGoals()),
  saveGoal: (name, data) => dispatch(actions.goals.saveGoal({ data, name })),
  signupActions: bindActionCreators(actions.signup, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(ProductPickerContainer)
