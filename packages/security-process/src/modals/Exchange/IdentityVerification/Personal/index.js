import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { find, map, prop, propEq, test, head } from 'ramda'

import { actions, model } from 'data'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4'

import Personal from './template'
import Loading from './template.loading'
import DataError from 'components/DataError'

export const SCROLL_REF_ID = 'scroll-ref-id'

const getCountryElements = countries => [
  {
    group: '',
    items: map(
      country => ({
        value: country,
        text: country.name
      }),
      countries
    )
  }
]

const { PERSONAL_FORM, EMAIL_STEPS } = model.components.identityVerification
const { PERSONAL } = model.analytics.KYC_EVENTS.FORMS

class PersonalContainer extends React.PureComponent {
  state = {
    initialEmailVerified: this.props.emailVerified
  }

  componentDidMount () {
    this.fetchData()
  }

  componentDidUpdate (prevProps) {
    const { coinifyUserCountry, formActions, countryData } = this.props
    // change form field on mount to coinify country if on buy-sell since we're skipping country selection
    if (
      test(/buy-sell/, this.props.pathName) &&
      (!Remote.Success.is(prevProps.countryData) &&
        Remote.Success.is(countryData))
    ) {
      const supportedCountries = prop(
        'supportedCountries',
        countryData.getOrElse()
      )
      const isUserCountry = propEq('code', coinifyUserCountry)
      const countryObject = head(supportedCountries.filter(isUserCountry))
      if (countryObject)
        formActions.change(PERSONAL_FORM, 'country', countryObject)
    }
  }

  scrollTop = () => {
    const overflowElement = document.getElementById(SCROLL_REF_ID)
    overflowElement.scrollTop = 0
  }

  fetchData = () => {
    this.props.actions.fetchSupportedCountries()
    this.props.actions.fetchStates(this.props.isCoinify)
  }

  logEvent = val => {
    this.props.analyticsActions.logEvent([...PERSONAL, val])
  }

  selectAddress = (e, address) => {
    e.preventDefault()
    this.props.actions.selectAddress(address)
  }

  onCountryChange = (e, value) => {
    e.preventDefault()
    this.props.formActions.change(PERSONAL_FORM, 'country', value)
    this.props.formActions.clearFields(PERSONAL_FORM, false, false, 'state')
  }

  onPromptForEmailVerification = e => {
    e.preventDefault()
    this.scrollTop()
    this.setState({ showEmailError: true })
  }

  editEmail = () => {
    this.props.actions.setEmailStep(EMAIL_STEPS.edit)
  }

  renderForm = ({
    actions,
    initialCountryCode,
    initialEmail,
    email,
    emailVerified,
    emailStep,
    countryCode,
    countryAndStateSelected,
    stateSupported,
    postCode,
    activeField,
    activeFieldError,
    addressRefetchVisible,
    user,
    supportedCountries,
    states,
    handleSubmit
  }) => (
    <Personal
      initialValues={{
        ...user,
        state:
          user.country === 'US'
            ? find(propEq('code', user.state), states) || {}
            : user.state,
        country:
          find(propEq('code', user.country), supportedCountries) ||
          find(propEq('code', initialCountryCode), supportedCountries),
        email: initialEmail
      }}
      showEmail={!this.state.initialEmailVerified}
      showEmailError={!emailVerified && this.state.showEmailError}
      emailVerified={emailVerified}
      email={email}
      emailStep={emailStep}
      countryCode={countryCode}
      countryIsUS={countryCode && countryCode === 'US'}
      showStateError={countryAndStateSelected && !stateSupported}
      showPersonal={countryAndStateSelected && stateSupported}
      postCode={postCode}
      supportedCountries={getCountryElements(supportedCountries)}
      states={getCountryElements(states)}
      addressRefetchVisible={addressRefetchVisible}
      activeField={activeField}
      activeFieldError={activeFieldError}
      editEmail={this.editEmail}
      updateEmail={actions.updateEmail}
      sendEmailVerification={actions.sendEmailVerification}
      onPromptForEmailVerification={this.onPromptForEmailVerification}
      onAddressSelect={this.selectAddress}
      onCountrySelect={this.onCountryChange}
      onFieldBlur={this.logEvent}
      onSubmit={handleSubmit}
    />
  )

  render () {
    const { countryData, userData, ...rest } = this.props
    return countryData.cata({
      Success: ({ supportedCountries, states }) =>
        userData.cata({
          Success: user =>
            this.renderForm({ ...rest, supportedCountries, states, user }),
          NotAsked: () => <Loading />,
          Loading: () => <Loading />,
          Failure: () =>
            this.renderForm({ ...rest, supportedCountries, states, user: {} })
        }),
      NotAsked: () => <Loading />,
      Loading: () => <Loading />,
      Failure: () => <DataError onClick={this.props.actions.fetchData} />
    })
  }
}

PersonalContainer.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialCountryCode: PropTypes.string,
  supportedCountries: PropTypes.instanceOf(Remote).isRequired,
  countryCode: PropTypes.string
}

PersonalContainer.defaultProps = {
  initialCountryCode: '',
  countryCode: ''
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    { ...actions.components.identityVerification, ...actions.modules.profile },
    dispatch
  ),
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(PersonalContainer)
