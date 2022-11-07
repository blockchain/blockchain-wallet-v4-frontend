import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { find, pathOr, propEq } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Remote } from '@core'
import { RemoteDataType, WalletOptionsType } from '@core/types'
import { Image } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ProductSignupMetadata } from 'data/types'

import BuyGoal from './BuyGoal'
import Header from './components/Header'
import SignupCard from './components/SignupCard'
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

export const SIGNUP_FORM = 'register'

const qsParams = new URLSearchParams(window.location.hash)
const isLatam = qsParams.has('latam')

class SignupContainer extends React.PureComponent<
  InjectedFormProps<{}, Props> & Props,
  StateProps
> {
  constructor(props) {
    super(props)
    this.state = {
      showForm: true,
      showState: false
    }
  }

  componentDidMount() {
    const { signupActions, websocketActions } = this.props
    // start sockets to ensure email verify flow is detected
    websocketActions.startSocket()
    signupActions.initializeSignup()
    if (window?._SardineContext) {
      window._SardineContext.updateConfig({
        flow: 'SIGNUP'
      })
    }
  }

  onCountryChange = (e: React.ChangeEvent<HTMLInputElement> | undefined, value: string) => {
    this.setDefaultCountry(value)
    this.props.formActions.clearFields(SIGNUP_FORM, false, false, 'state')
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { formValues, language, signupActions } = this.props
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

  setCountryOnLoad = (country: string) => {
    this.setDefaultCountry(country)
    this.props.formActions.change(SIGNUP_FORM, 'country', country)
  }

  setDefaultCountry = (country: string) => {
    this.setState({ showState: country === 'US' })
  }

  toggleSignupFormVisibility = () => {
    this.setState({ showForm: true })
  }

  render() {
    const { goals, isLoadingR } = this.props
    const isFormSubmitting = Remote.Loading.is(isLoadingR)

    // pull email from simple buy goal if it exists or signup goal
    const email =
      pathOr('', ['data', 'email'], find(propEq('name', 'buySell'), goals)) ||
      pathOr('', ['data', 'email'], find(propEq('name', 'signup'), goals))

    const signupInitialValues = (email ? { email } : {}) as SignupFormInitValuesType
    const isLinkAccountGoal = !!find(propEq('name', 'linkAccount'), goals)
    const isBuyGoal = !!find(propEq('name', 'buySell'), goals)

    const subviewProps = {
      isFormSubmitting,
      isLinkAccountGoal,
      onCountrySelect: this.onCountryChange,
      onSignupSubmit: this.onSubmit,
      setDefaultCountry: this.setCountryOnLoad,
      showForm: this.state.showForm,
      showState: this.state.showState,
      toggleSignupFormVisibility: this.toggleSignupFormVisibility,
      ...this.props, // order here matters as we may need to override initial form values!
      initialValues: signupInitialValues
    }

    return (
      <SignupWrapper>
        {isLatam && <Header />}
        {isLinkAccountGoal && <ExchangeLinkGoal {...subviewProps} />}
        {isBuyGoal && <BuyGoal {...subviewProps} />}
        {!isLinkAccountGoal && !isBuyGoal && !isLatam && <SignupCard {...subviewProps} />}
        {!isLinkAccountGoal && !isBuyGoal && isLatam && (
          <LatamWrapper>
            <SignupCard {...subviewProps} />
            <LatamPhone>
              <Image width='569px' name='latam-signup-phone' />
            </LatamPhone>
          </LatamWrapper>
        )}
      </SignupWrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    exchange: 'https://exchange.blockchain.com'
  } as WalletOptionsType['domains']),
  formValues: selectors.form.getFormValues(SIGNUP_FORM)(state) as SignupFormType,
  goals: selectors.goals.getGoals(state) as GoalDataType,
  isLoadingR: selectors.signup.getRegistering(state) as RemoteDataType<string, undefined>,
  isReferralEnabled: selectors.core.walletOptions
    .getReferralEnabled(state)
    .getOrElse(false) as boolean,
  isValidReferralCode: selectors.signup.getIsValidReferralCode(state),
  language: selectors.preferences.getLanguage(state),
  search: selectors.router.getSearch(state) as string,
  signupMetadata: selectors.signup.getProductSignupMetadata(state) as ProductSignupMetadata,
  unified: selectors.cache.getUnifiedAccountStatus(state) as boolean
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  signupActions: bindActionCreators(actions.signup, dispatch),
  websocketActions: bindActionCreators(actions.ws, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  domains: WalletOptionsType['domains']
  formValues: SignupFormType
  goals: GoalDataType
  isLoadingR: RemoteDataType<string, undefined>
  isReferralEnabled: boolean
  isValidReferralCode?: boolean
  language: string
  search: string
  signupMetadata: ProductSignupMetadata
  unified: boolean
}
type StateProps = {
  showForm: boolean
  showState: boolean
}

export type Props = ConnectedProps<typeof connector> & LinkStatePropsType

const enhance = compose(reduxForm<{}, Props>({ form: SIGNUP_FORM }), connector)

export default enhance(SignupContainer) as React.ComponentClass<Props>
