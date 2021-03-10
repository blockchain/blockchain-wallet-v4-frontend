import React from 'react'
import PropTypes from 'prop-types'

import modalEnhancer from 'providers/ModalEnhancer'

import UpgradeAddressLabels from './template.js'

class UpgradeAddressLabelsContainer extends React.PureComponent {
  render() {
    return <UpgradeAddressLabels {...this.props} />
  }
}

UpgradeAddressLabelsContainer.propTypes = {
  duration: PropTypes.number
}

export default modalEnhancer('UpgradeAddressLabels')(
  UpgradeAddressLabelsContainer
)
