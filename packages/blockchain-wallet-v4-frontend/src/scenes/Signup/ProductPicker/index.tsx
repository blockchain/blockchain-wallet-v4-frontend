import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { RemoteDataType } from '@core/types'
import { SpinningLoader } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { ExchangeAuthOriginType } from 'data/types'

import ProductPicker from './template'
import Error from './template.error'
import ExchangeUserConflict from './template.error.exchange'

const ProductPickerContainer: React.FC<Props> = (props) => {
  const walletRedirect = () => {
    props.signupActions.setRegisterEmail(undefined)
    props.routerActions.push('/home')
    // for first time login users we need to run goal since this is a first page we show them
    props.saveGoal('welcomeModal', { firstLogin: true })
    props.runGoals()
  }

  const exchangeRedirect = () => {
    props.signupActions.setRegisterEmail(undefined)
    props.profileActions.authAndRouteToExchangeAction(ExchangeAuthOriginType.Signup)
  }

  return props.walletLoginData.cata({
    Failure: (error) => <Error error={error} />,
    Loading: () => <SpinningLoader />,
    NotAsked: () => {
      props.routerActions.push('/login?product=exchange')
      return null
    },
    Success: () =>
      props.exchangeUserConflict ? (
        <ExchangeUserConflict {...props} walletRedirect={walletRedirect} />
      ) : (
        <ProductPicker
          {...props}
          walletRedirect={walletRedirect}
          exchangeRedirect={exchangeRedirect}
        />
      )
  })
}
const mapStateToProps = (state) => ({
  appEnv: selectors.core.walletOptions.getAppEnv(state).getOrElse('prod'),
  email: selectors.signup.getRegisterEmail(state) as string,
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
