import React from 'react'
import PropTypes from 'prop-types'
import { defaultTo, find, pipe, prop, propEq, map } from 'ramda'
import { FormattedMessage } from 'react-intl'
import countryRegionData from 'country-region-data'

import SelectBox from '../SelectBox'

class SelectBoxRegion extends React.PureComponent {
  static propTypes = {
    countryCode: PropTypes.string
  }
  static defaultProps = {
    countryCode: null
  }

  render () {
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
          <FormattedMessage
            id='components.selectboxcountry.label'
            defaultMessage='Select state/region'
          />
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
