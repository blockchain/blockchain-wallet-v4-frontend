import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { map, find, propEq } from 'ramda'

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

const getAddressElements = addresses => [
  {
    group: '',
    items: map(address => {
      const { line1, line2, postCode, city, state } = address
      return {
        value: address,
        text: `${line1} ${line2} ${postCode}, ${city}, ${state}`
      }
    }, addresses)
  }
]

const { AddressPropType } = model.profile
const { PERSONAL_FORM } = model.components.identityVerification

class PersonalContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.fetchSupportedCountries()
  }

  onPostCodeChange = (_, postCode) => {
    const { countryCode, actions, formActions } = this.props

    formActions.touch(PERSONAL_FORM, 'postCode')
    actions.fetchPossibleAddresses(postCode, countryCode)
  }

  selectAddress = (_, address) => {
    this.props.actions.selectAddress(address)
  }

  render () {
    const {
      supportedCountries,
      initialCountryCode,
      countryCode,
      possibleAddresses,
      address,
      postCode,
      activeField,
      addressRefetchVisible,
      actions,
      userData,
      handleSubmit
    } = this.props

    return supportedCountries.cata({
      Success: supportedCountries => (
        <Personal
          initialValues={{
            ...userData,
            country:
              find(propEq('code', userData.country), supportedCountries) ||
              find(propEq('code', initialCountryCode), supportedCountries)
          }}
          countryCode={countryCode}
          postCode={postCode}
          supportedCountries={getCountryElements(supportedCountries)}
          possibleAddresses={getAddressElements(possibleAddresses)}
          address={address}
          addressRefetchVisible={addressRefetchVisible}
          activeField={activeField}
          onAddressSelect={this.selectAddress}
          onCountrySelect={actions.setPossibleAddresses.bind(null, [])}
          onPostCodeChange={this.onPostCodeChange}
          onSubmit={handleSubmit}
        />
      ),
      NotAsked: () => <Loading />,
      Loading: () => <Loading />,
      Failure: () => <DataError onClick={actions.fetchSupportedCountries} />
    })
  }
}

PersonalContainer.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialCountryCode: PropTypes.string,
  supportedCountries: PropTypes.instanceOf(Remote).isRequired,
  possibleAddresses: PropTypes.arrayOf(AddressPropType),
  countryCode: PropTypes.string,
  address: AddressPropType,
  addressRefetchVisible: PropTypes.bool
}

PersonalContainer.defaultProps = {
  addressRefetchVisible: false,
  initialCountryCode: '',
  possibleAddresses: [],
  countryCode: '',
  address: null
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
