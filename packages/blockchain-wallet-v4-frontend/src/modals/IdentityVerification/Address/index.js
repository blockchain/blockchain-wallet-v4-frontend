import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { map, find, propEq } from 'ramda'

import { actions } from 'data'
import { AddressPropType } from 'data/modules/profile/model'
import { Remote } from 'blockchain-wallet-v4'
import { getData } from './selectors'
import Address from './template'
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

class AddressContainer extends React.PureComponent {
  componentDidMount () {
    this.props.actions.fetchSupportedCountries()
  }

  fetchPossibleAddresses = (_, postCode) => {
    const { countryCode, actions } = this.props

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
      handleSubmit,
      actions
    } = this.props

    return supportedCountries.cata({
      Success: countries => (
        <Address
          initialValues={{
            country: find(propEq('code', initialCountryCode), countries)
          }}
          countryCode={countryCode}
          supportedCountries={getCountryElements(countries)}
          possibleAddresses={getAddressElements(possibleAddresses)}
          address={address}
          onAddressSelect={this.selectAddress}
          onPostCodeChange={this.fetchPossibleAddresses}
          onSubmit={handleSubmit}
        />
      ),
      NotAsked: () => <Loading />,
      Loading: () => <Loading />,
      Failure: () => <DataError onClick={actions.fetchSupportedCountries} />
    })
  }
}

AddressContainer.propTypes = {
  initialCountryCode: PropTypes.string,
  supportedCountries: PropTypes.instanceOf(Remote).isRequired,
  possibleAddresses: PropTypes.arrayOf(AddressPropType),
  countryCode: PropTypes.string,
  address: AddressPropType
}

AddressContainer.defaultProps = {
  initialCountryCode: '',
  possibleAddresses: [],
  countryCode: '',
  address: null
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.identityVerification, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(AddressContainer)
