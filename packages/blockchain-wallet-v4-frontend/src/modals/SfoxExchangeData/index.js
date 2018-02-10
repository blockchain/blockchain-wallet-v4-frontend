import React from 'react'
import PropTypes from 'prop-types'
import modalEnhancer from 'providers/ModalEnhancer'
import { compose } from 'redux'
import Tray from 'components/Tray'
import { ModalHeader, ModalBody } from 'blockchain-info-components'

class SfoxExchangeData extends React.Component {
  constructor () {
    super()
    this.state = { show: false }
  }

  componentDidMount () {
    this.setState({ show: true })
  }

  handleClose () {
    this.setState({ show: false })
    setTimeout(this.props.close, 500)
  }

  render () {
    return (
      <Tray in={this.state.show} class='tray'>
        <ModalHeader onClose={this.handleClose.bind(this)}>
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
