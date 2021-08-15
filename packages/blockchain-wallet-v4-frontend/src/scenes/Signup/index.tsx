import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { find, propEq, propOr } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Remote } from 'blockchain-wallet-v4/src'
import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { GoalsType } from 'data/goals/types'
import { RootState } from 'data/rootReducer'

import BuyGoal from './BuyGoal'
import ExchangeLinkGoal from './ExchangeLinkGoal'
import SignupLanding from './SignupLanding'
import { GeoLocationType, SignupFormInitValuesType, SignupFormType } from './types'

const SignupWrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
`

const SIGNUP_FORM = 'register'

class SignupContainer extends React.PureComponent<
  InjectedFormProps<{}, Props> & Props,
  StateProps
> {
  constructor(props) {
    super(props)
    this.state = {
      showForm: props.search.includes('showWallet'),
      showState: false
    }
  }

  componentDidMount() {
    this.props.authActions.getUserGeoLocation()
  }

  onSubmit = (e) => {
    e.preventDefault()
    const { authActions, formValues, language } = this.props
    const { country, email, password, state } = formValues
    authActions.register(email, password, language, country, state)
  }

  toggleForm = () => {
    this.setState({ showForm: true })
  }

  onCountryChange = (e: React.SyntheticEvent, value: string) => {
    this.setDefaultCountry(value)
    this.props.formActions.clearFields(SIGNUP_FORM, false, false, 'state')
  }

  setDefaultCountry = (country: string) => {
    this.setState({ showState: country === 'US' })
  }

  render() {
    const { goals, isLoadingR, userGeoData } = this.props
    const isFormSubmitting = Remote.Loading.is(isLoadingR)

    // TODO: cleanup these variables
    const dataGoal = find(propEq('name', 'simpleBuy'), goals)
    const goalData = propOr({}, 'data', dataGoal)
    const email = propOr('', 'email', goalData)
    const signupInitialValues = email
      ? ({ email } as SignupFormInitValuesType)
      : ({} as SignupFormInitValuesType)
    if (userGeoData && userGeoData.countryCode) {
      signupInitialValues.country = userGeoData.countryCode
    }
    const isLinkAccountGoal = !!find(propEq('name', 'linkAccount'), goals)
    const isBuyGoal = !!find(propEq('name', 'simpleBuy'), goals)

    const props = {
      handleSubmit: this.onSubmit,
      initialValues: signupInitialValues,
      isFormSubmitting: isFormSubmitting || !userGeoData, // TODO why is userGeoData here?
      isLinkAccountGoal,
      onCountrySelect: this.onCountryChange,
      showForm: this.state.showForm,
      showState: this.state.showState,
      toggleForm: this.toggleForm,
      ...this.props
    }

    return (
      <SignupWrapper>
        {isLinkAccountGoal && <ExchangeLinkGoal {...props} />}
        {isBuyGoal && <BuyGoal {...props} />}
        {!isLinkAccountGoal && !isBuyGoal && <SignupLanding {...props} />}
      </SignupWrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  formValues: selectors.form.getFormValues(SIGNUP_FORM)(state) as SignupFormType,
  goals: selectors.goals.getGoals(state),
  isLoadingR: selectors.auth.getRegistering(state) as RemoteDataType<string, any>,
  language: selectors.preferences.getLanguage(state),
  search: selectors.router.getSearch(state) as string,
  userGeoData: selectors.auth.getUserGeoData(state) as GeoLocationType
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  alertActions: bindActionCreators(actions.alerts, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  authActions: bindActionCreators(actions.auth, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  formValues: SignupFormType
  goals: Array<{
    data: any
    id: string
    name: GoalsType
  }>
  isLoadingR: RemoteDataType<string, any>
  language: string
  search: string
  userGeoData: GeoLocationType
}
type StateProps = {
  showForm: boolean
  showState: boolean
}
export type Props = ConnectedProps<typeof connector> & LinkStatePropsType

const enhance = compose(reduxForm<{}, Props>({ form: SIGNUP_FORM }), connector)

export default enhance(SignupContainer) as React.ComponentClass<Props>
