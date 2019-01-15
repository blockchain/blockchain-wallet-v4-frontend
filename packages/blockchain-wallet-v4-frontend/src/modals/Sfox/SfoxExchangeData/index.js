import React from 'react'
import PropTypes from 'prop-types'
import modalEnhancer from 'providers/ModalEnhancer'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { path } from 'ramda'

import StepIndicator from 'components/StepIndicator'
import Tray from 'components/Tray'
import Create from './Create'
import Verify from './Verify'
import Link from './Link'
import SiftScience from './sift-science'
import { ModalHeader, ModalBody } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { actions } from 'data'

class SfoxExchangeData extends React.PureComponent {
  state = { show: false }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  stepMap = {
    account: (
      <FormattedMessage
        id='modals.sfoxexchangedata.steps.createaccount'
        defaultMessage='Account'
      />
    ),
    verify: (
      <FormattedMessage
        id='modals.sfoxexchangedata.steps.verifyidentity'
        defaultMessage='Identity'
      />
    ),
    upload: (
      <FormattedMessage
        id='modals.sfoxexchangedata.steps.uploadidentitydocs'
        defaultMessage='Verification'
      />
    ),
    funding: (
      <FormattedMessage
        id='modals.sfoxexchangedata.steps.linkbank'
        defaultMessage='Funding'
      />
    )
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, 500)
    this.props.sfoxFrontendActions.handleModalClose()
    // const step = this.props.signupStep || this.props.step
    // TODO @analytics.logEvent sfox signup funnel
  }

  getStepComponent = step => {
    switch (step) {
      case 'account':
        return { component: <Create />, step: 'account' }
      case 'verify':
        return { component: <Verify />, step: 'verify' }
      case 'funding':
        return { component: <Link />, step: 'funding' }
      case 'upload':
        return { component: <Verify step='upload' />, step: 'upload' }
      case 'jumio':
        return { component: <Verify step='jumio' />, step: 'upload' }
      case 'verified': {
        this.handleClose()
        break
      }
    }
  }

  render () {
    const step = this.props.signupStep || this.props.step

    return (
      <Tray
        position={this.props.position}
        total={this.props.total}
        in={this.state.show}
        class='tray'
        onClose={this.handleClose}
      >
        <ModalHeader tray center onClose={this.handleClose}>
          <StepIndicator
            step={this.getStepComponent(step)['step']}
            stepMap={this.stepMap}
          />
        </ModalHeader>
        <ModalBody>
          {this.getStepComponent(step)['component']}
          {this.props.siftScienceEnabled ? <SiftScience /> : null}
        </ModalBody>
      </Tray>
    )
  }
}

SfoxExchangeData.propTypes = {
  step: PropTypes.oneOf(['account', 'verify', 'upload', 'jumio', 'funding']),
  close: PropTypes.func
}

const mapStateToProps = state => ({
  data: getData(state),
  signupStep: path(['sfoxSignup', 'signupStep'], state),
  siftScienceEnabled: path(['sfoxSignup', 'siftScienceEnabled'], state)
})

const mapDispatchToProps = dispatch => ({
  sfoxFrontendActions: bindActionCreators(actions.modules.sfox, dispatch),
  sfoxDataActions: bindActionCreators(actions.core.data.sfox, dispatch),
  analytics: bindActionCreators(actions.analytics, dispatch)
})

const enhance = compose(
  modalEnhancer('SfoxExchangeData'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(SfoxExchangeData)
