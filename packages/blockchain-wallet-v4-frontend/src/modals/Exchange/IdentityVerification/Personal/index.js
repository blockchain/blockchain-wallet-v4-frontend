import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { find, map, propEq } from 'ramda'

import { actions, model } from 'data'
import { getData } from './selectors'
import { Remote } from 'blockchain-wallet-v4'

import Personal from './template'
import Loading from './template.loading'
import DataError from 'components/DataError'

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

class PersonalContainer extends React.PureComponent {
  state = {
    initialEmailVerified: this.props.emailVerified
  }

  componentDidMount () {
    this.fetchData()
  }

  fetchData = () => {
    this.props.actions.fetchSupportedCountries()
    this.props.actions.fetchStates()
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
      onAddressSelect={this.selectAddress}
      onCountrySelect={this.onCountryChange}
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
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(PersonalContainer)
