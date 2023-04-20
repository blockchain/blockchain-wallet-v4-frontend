import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from '@core'
import { RemoteDataType } from '@core/types'
import { SpinningLoader } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import {
  ExchangeAuthOriginType,
  PlatformTypes,
  ProductEligibilityForUser,
  ProductSignupMetadata
} from 'data/types'

import ProductPicker from './template'
import Error from './template.error'
import ExchangeUserConflict from './template.error.exchange'
import ExchangeMobileUserConflict from './template.error.exchangeMobile'

const ProductPickerContainer: React.FC<Props> = (props) => {
  const [showExchangeUserConflict, setExchangeUserConflict] = useState(false)

  useEffect(() => {
    props.custodialActions.fetchProductEligibilityForUser()
  }, [])

  const isExchangeMobileSignup =
    props.signupMetadata?.platform === PlatformTypes.ANDROID ||
    props.signupMetadata?.platform === PlatformTypes.IOS

  const walletRedirect = () => {
    props.signupActions.setRegisterEmail(undefined)
    props.routerActions.push('/home')
    // for first time login users we need to run goal since this is a first page we show them
    props.saveGoal('welcomeModal', { firstLogin: true })
    props.runGoals()
  }

  const exchangeRedirect = () => {
    if (props.exchangeUserConflict) {
      setExchangeUserConflict(true)
    } else {
      props.signupActions.setRegisterEmail(undefined)
      props.profileActions.authAndRouteToExchangeAction(ExchangeAuthOriginType.Signup)
    }
  }
  const isMetadataRecovery = Remote.Success.is(props.isMetadataRecoveryR)

  if (props.products?.exchange?.hideExchangeOption) {
    props.routerActions.push('/home')
  }

  return props.walletLoginData.cata({
    Failure: (error) =>
      error === 4 && isExchangeMobileSignup ? (
        <ExchangeMobileUserConflict {...props} />
      ) : (
        <Error error={error} />
      ),
    Loading: () => <SpinningLoader />,
    NotAsked: () => {
      if (isMetadataRecovery) {
        props.routerActions.push('/home')
        return null
      }
      props.routerActions.push('/login?product=exchange')
      return null
    },
    Success: () =>
      showExchangeUserConflict ? (
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
  isAccountReset: selectors.signup.getAccountReset(state) as boolean,
  isMetadataRecoveryR: selectors.signup.getMetadataRestore(state),
  products: selectors.custodial.getProductEligibilityForUser(state).getOrElse({
    notifications: []
  } as ProductEligibilityForUser),
  showExchangeLoginButton: selectors.core.walletOptions
    .getExchangeMobileDuplicateAccountRedirect(state)
    .getOrElse(false) as boolean,
  signupMetadata: selectors.signup.getProductSignupMetadata(state) as ProductSignupMetadata,
  walletLoginData: selectors.auth.getLogin(state) as RemoteDataType<any, any>
})

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  custodialActions: bindActionCreators(actions.custodial, dispatch),
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
