import React from 'react'
import PropTypes from 'prop-types'
import modalEnhancer from 'providers/ModalEnhancer'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StepIndicator from 'components/StepIndicator'
import Tray from 'components/Tray'
import Create from './Create'
import Verify from './Verify'
import Link from './Link'
// import Upload from './Upload'
import { ModalHeader, ModalBody } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { actions } from 'data'
import { path } from 'ramda'

class SfoxExchangeData extends React.PureComponent {
  constructor () {
    super()
    this.state = { show: false }
    this.stepMap = {
      account: <FormattedMessage id='modals.sfoxexchangedata.steps.account' defaultMessage='Account' />,
      verify: <FormattedMessage id='modals.sfoxexchangedata.steps.verify' defaultMessage='Verify' />,
      funding: <FormattedMessage id='modals.sfoxexchangedata.steps.funding' defaultMessage='Funding' />,
      submit: <FormattedMessage id='modals.sfoxexchangedata.steps.submit' defaultMessage='Submit' />
    }
  }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose () {
    this.setState({ show: false })
    setTimeout(this.props.close, 500)
  }

  getStepComponent (step) {
    switch (step) {
      case 'account': return { component: <Create />, step: 'account' }
      case 'verify': return { component: <Verify />, step: 'verify' }
      case 'funding': return { component: <Link />, step: 'funding' }
      case 'upload': return { component: <Verify step='upload' />, step: 'verify' }
      case 'verified': {
        this.handleClose()
        break
      }
    }
  }

  render () {
    const { show } = this.state
    const step = this.props.signupStep || this.props.step

    return (
      <Tray position={this.props.position} total={this.props.total} in={show} class='tray' onClose={this.handleClose.bind(this)}>
        <ModalHeader tray center onClose={this.handleClose.bind(this)}>
          <StepIndicator step={this.getStepComponent(step)['step']} stepMap={this.stepMap} />
        </ModalHeader>
        <ModalBody>
          { this.getStepComponent(step)['component'] }
        </ModalBody>
      </Tray>
    )
  }
}

SfoxExchangeData.propTypes = {
  step: PropTypes.oneOf(['account', 'verify', 'upload', 'funding']),
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
