import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'

import modalEnhancer from 'providers/ModalEnhancer'
import UpgradeAddressLabels from './template.js'

class UpgradeAddressLabelsContainer extends React.PureComponent {
  render () {
    return <UpgradeAddressLabels {...this.props} />
  }
}

UpgradeAddressLabelsContainer.propTypes = {
  duration: PropTypes.number
}

const enhance = compose(
  modalEnhancer('UpgradeAddressLabels'),
  connect(undefined, undefined)
)

export default enhance(UpgradeAddressLabelsContainer)
