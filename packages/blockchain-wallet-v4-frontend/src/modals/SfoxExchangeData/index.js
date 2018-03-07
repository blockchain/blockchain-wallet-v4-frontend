import React from 'react'
import PropTypes from 'prop-types'
import modalEnhancer from 'providers/ModalEnhancer'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Tray from 'components/Tray'
import Create from './Create'
import Verify from './Verify'
import Upload from './Upload'
import Link from './Link'
import { ModalHeader, ModalBody } from 'blockchain-info-components'
import { getData } from './selectors'
import { determineStep } from 'services/SfoxService'
import { actions } from 'data'
import { path } from 'ramda'

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
    const step = this.props.signupStep || this.props.step
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
    const { show } = this.state
    const { data } = this.props
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
  data: getData(state),
  signupStep: path(['sfoxSignup', 'signupStep'], state)
})

const mapDispatchToProps = (dispatch) => ({
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('SfoxExchangeData')
)

export default enhance(SfoxExchangeData)
