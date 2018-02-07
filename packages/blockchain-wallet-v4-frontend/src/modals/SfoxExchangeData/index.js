import React from 'react'
import PropTypes from 'prop-types'
import modalEnhancer from 'providers/ModalEnhancer'
import { compose } from 'redux'
import Tray from 'components/Tray'
import { ModalHeader, ModalBody } from 'blockchain-info-components'

class SfoxExchangeData extends React.Component {
  render () {
    return (
      <Tray>
        <ModalHeader onClose={this.props.close}>
          sfox
        </ModalHeader>
        <ModalBody>
          { this.props.step }
        </ModalBody>
      </Tray>
    )
  }
}

SfoxExchangeData.PropTypes = {
  step: PropTypes.string.isRequired
}

const enhance = compose(modalEnhancer('SfoxExchangeData'))

export default enhance(SfoxExchangeData)
