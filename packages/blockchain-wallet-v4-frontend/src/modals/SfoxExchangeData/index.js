import React from 'react'
import PropTypes from 'prop-types'
import modalEnhancer from 'providers/ModalEnhancer'
import { compose } from 'redux'
import Tray from 'components/Tray'
import Verify from './Verify'
import Upload from './Upload'
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

  getStepComponent (step) {
    console.log('sfoxExchange render', this.props)
    switch (step) {
      case 'verify': return <Verify />
      case 'upload': return <Upload />
    }
  }

  render () {
    const { step } = this.props
    const { show } = this.state
    return (
      <Tray in={show} class='tray'>
        <ModalHeader onClose={this.handleClose.bind(this)}>
          <div>sfox</div>
          {/* <GenericStepIndicator steps=this.props.steps step=this.prop.step> */}
        </ModalHeader>
        <ModalBody>
          { this.getStepComponent(step) }
        </ModalBody>
      </Tray>
    )
  }
}

SfoxExchangeData.PropTypes = {
  step: PropTypes.oneOf(['verify'])
}

const enhance = compose(modalEnhancer('SfoxExchangeData'))

export default enhance(SfoxExchangeData)
