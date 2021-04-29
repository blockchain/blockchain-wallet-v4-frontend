import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { defaultTo, find, map, pipe, prop, propEq } from 'ramda'

import SelectBox from '../SelectBox'

const countryRegionData = React.lazy(() => import('country-region-data'))
const countriesWithStates = ['US']

export const countryHasStates = countryCode =>
  countriesWithStates.includes(countryCode)

class SelectBoxRegion extends React.PureComponent {
  static propTypes = {
    countryCode: PropTypes.string
  }

  static defaultProps = {
    countryCode: null
  }

  render() {
    const { countryCode } = this.props
    const regions = pipe(
      find(propEq('countryShortCode', countryCode)),
      defaultTo(emptyRegions),
      prop('regions'),
      map(({ name, shortCode }) => ({ text: name, value: shortCode }))
    )(countryRegionData)
    const elements = [{ group: '', items: regions }]

    return (
      <SelectBox
        label={
          countryHasStates(countryCode) ? (
            <FormattedMessage
              id='components.selectboxregion.placeholder.state'
              defaultMessage='Select state'
            />
          ) : (
            <FormattedMessage
              id='components.selectboxregion.placeholder.region'
              defaultMessage='Select region'
            />
          )
        }
        elements={elements}
        {...this.props}
      />
    )
  }
}

const emptyRegions = {
  regions: []
}

export default SelectBoxRegion
