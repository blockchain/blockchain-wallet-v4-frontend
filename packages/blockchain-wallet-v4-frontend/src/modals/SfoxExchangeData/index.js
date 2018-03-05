import React from 'react'
import PropTypes from 'prop-types'
import modalEnhancer from 'providers/ModalEnhancer'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Tray from 'components/Tray'
import Create from './Create'
import Verify from './Verify'
import Upload from './Upload'
import Link from './Link'
import { ModalHeader, ModalBody } from 'blockchain-info-components'
import { getData } from './selectors'
import { determineStep } from 'services/SfoxService'

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

  getStepComponent () {
    const { profile, verificationStatus, accounts } = this.props.data.getOrElse({})
    const step = determineStep(profile, verificationStatus, accounts)

    switch (step) {
      case 'create': return <Create />
      case 'verify': return <Verify />
      case 'upload': return <Upload />
      case 'link': return <Link />
      case 'verified': {
        this.handleClose()
        break
      }
    }
  }

  render () {
    // const { step } = this.props
    const { show } = this.state
    return (
      <Tray in={show} class='tray'>
        <ModalHeader onClose={this.handleClose.bind(this)}>
          <div>sfox</div>
          {/* <GenericStepIndicator steps=this.props.steps step=this.prop.step> */}
        </ModalHeader>
        <ModalBody>
          { this.getStepComponent() }
        </ModalBody>
      </Tray>
    )
  }
}

SfoxExchangeData.propTypes = {
  step: PropTypes.oneOf(['create', 'verify', 'upload', 'link']),
  close: PropTypes.function
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const enhance = compose(
  connect(mapStateToProps, undefined),
  modalEnhancer('SfoxExchangeData')
)

export default enhance(SfoxExchangeData)
