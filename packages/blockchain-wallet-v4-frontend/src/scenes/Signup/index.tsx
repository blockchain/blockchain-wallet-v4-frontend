import React, { useEffect, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { pathOr } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Remote } from '@core'
import { RemoteDataType, WalletOptionsType } from '@core/types'
import { Image } from 'blockchain-info-components'
import { UkBanner } from 'components/Banner'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import {
  GoalsType,
  ProductAuthMetadata,
  ProductSignupMetadata,
  RegisteringFailureType,
  RegisteringSuccessType
} from 'data/types'

import BuyGoal from './BuyGoal'
import Header from './components/Header'
import SignupCard from './components/SignupCard'
import SofiSignupCard from './components/SofiSignupCard'
import ExchangeLinkGoal from './ExchangeLinkGoal'
import { GoalDataType, SignupFormInitValuesType, SignupFormType } from './types'

const SignupWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
`

const LatamPhone = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 100px;
  color: white;
  @media (max-width: 768px) {
    margin-left: 0;
    position: relative;
    top: 50px;
    align-items: center;
  }
`

const LatamWrapper = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const UKHeaderWrapper = styled.div`
  position: absolute;
  width: 100vw;
  top: 0;
  z-index: 2;
`
export const SIGNUP_FORM = 'register'

const isLatam = new URLSearchParams(window.location.hash).has('latam')

const findGoalByName = (name: GoalsType, goals: GoalDataType) =>
  goals.find((goal) => goal.name === name)

const SignupContainer: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const [showForm, setShowForm] = useState(true)
  const [showState, setShowState] = useState(false)

  const setDefaultCountry = (country: string) => {
    setShowState(country === 'US')
  }

  const onCountryChange = (e: React.ChangeEvent<HTMLInputElement> | undefined, value: string) => {
    setDefaultCountry(value)
    props.formActions.clearFields(SIGNUP_FORM, false, false, 'state')
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const { formValues, language, signupActions } = props
    const { country, email, password, referral, state } = formValues

    signupActions.register({
      country,
      email,
      language,
      password,
      referral,
      state
    })
  }

  const setCountryOnLoad = (country: string) => {
    setDefaultCountry(country)
    props.formActions.change(SIGNUP_FORM, 'country', country)
  }

  const toggleSignupFormVisibility = () => {
    setShowForm(true)
  }

  useEffect(() => {
    const { signupActions, websocketActions } = props
    // start sockets to ensure email verify flow is detected
    websocketActions.startSocket()
    signupActions.initializeSignup()
    if (window?._SardineContext) {
      window._SardineContext.updateConfig({
        flow: 'SIGNUP'
      })
    }
  }, [])

  const { formValues, goals, isLoadingR, productAuthMetadata } = props
  const isFormSubmitting = Remote.Loading.is(isLoadingR)
  const isUserInUK = productAuthMetadata?.ipCountry === 'GB'
  const userSelectedUK = formValues?.country === 'GB'

  const buySellGoal = findGoalByName('buySell', goals)
  const signupGoal = findGoalByName('signup', goals)
  const linkAccountGoal = findGoalByName('linkAccount', goals)

  // pull email from simple buy goal if it exists or signup goal
  const email =
    pathOr('', ['data', 'email'], buySellGoal) || pathOr('', ['data', 'email'], signupGoal)

  const signupInitialValues = (email ? { email } : {}) as SignupFormInitValuesType
  const isLinkAccountGoal = !!linkAccountGoal
  const isBuyGoal = !!buySellGoal
  const isSofi = window.location.hash.includes('sofi')

  const subviewProps = {
    isFormSubmitting,
    isLinkAccountGoal,
    onCountrySelect: onCountryChange,
    onSignupSubmit: onSubmit,
    setDefaultCountry: setCountryOnLoad,
    showForm,
    showState,
    toggleSignupFormVisibility,
    ...props, // order here matters as we may need to override initial form values!
    initialValues: signupInitialValues
  }

  return (
    <>
      {(isUserInUK || userSelectedUK) && (
        <UKHeaderWrapper>
          <UkBanner userLoggedOut />
        </UKHeaderWrapper>
      )}
      <SignupWrapper>
        {isSofi && <SofiSignupCard {...subviewProps} />}
        {isLatam && <Header />}
        {isLinkAccountGoal && <ExchangeLinkGoal {...subviewProps} />}
        {isBuyGoal && <BuyGoal {...subviewProps} />}
        {!isLinkAccountGoal && !isBuyGoal && !isLatam && !isSofi && (
          <SignupCard {...subviewProps} />
        )}
        {!isLinkAccountGoal && !isBuyGoal && !isSofi && isLatam && (
          <LatamWrapper>
            <SignupCard {...subviewProps} />
            <LatamPhone>
              <Image width='569px' name='latam-signup-phone' />
            </LatamPhone>
          </LatamWrapper>
        )}
      </SignupWrapper>
    </>
  )
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  bakktRedirectUSStates: selectors.core.walletOptions.getBakktRedirectUSStates(state).getOrElse([]),
  domains: selectors.core.walletOptions
    .getDomains(state)
    .getOrElse({}) as WalletOptionsType['domains'],
  formValues: selectors.form.getFormValues(SIGNUP_FORM)(state) as SignupFormType,
  goals: selectors.goals.getGoals(state) as GoalDataType,
  isLoadingR: selectors.signup.getRegistering(state) as RemoteDataType<string, undefined>,
  isReferralEnabled: selectors.core.walletOptions
    .getReferralEnabled(state)
    .getOrElse(false) as boolean,
  isValidReferralCode: selectors.signup.getIsValidReferralCode(state),
  language: selectors.preferences.getLanguage(state),
  productAuthMetadata: selectors.auth.getProductAuthMetadata(state),
  registering: selectors.signup.getRegistering(state),
  search: selectors.router.getSearch(state) as string,
  signupMetadata: selectors.signup.getProductSignupMetadata(state) as ProductSignupMetadata
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  signupActions: bindActionCreators(actions.signup, dispatch),
  websocketActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  bakktRedirectUSStates: WalletOptionsType['bakktRedirectUSStates']
  domains: WalletOptionsType['domains']
  formValues: SignupFormType
  goals: GoalDataType
  isLoadingR: RemoteDataType<string, undefined>
  isReferralEnabled: boolean
  isValidReferralCode?: boolean
  language: string
  productAuthMetadata: ProductAuthMetadata
  registering: RemoteDataType<RegisteringFailureType, RegisteringSuccessType>
  search: string
  signupMetadata: ProductSignupMetadata
}

export type Props = ConnectedProps<typeof connector> & LinkStatePropsType

const enhance = compose(reduxForm<{}, Props>({ form: SIGNUP_FORM }), connector)

export default enhance(SignupContainer) as React.ComponentClass<Props>
