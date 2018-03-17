import React from 'react'
import PropTypes from 'prop-types'
import modalEnhancer from 'providers/ModalEnhancer'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import StepIndicator from 'components/StepIndicator'
import Tray from 'components/Tray'
import Create from './Create'
// import Verify from './Verify'
// import Link from './Link'
import { ModalHeader, ModalBody } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { actions } from 'data'
import { path } from 'ramda'

class SfoxExchangeData extends React.Component {
  constructor () {
    super()
    this.state = { show: false }
    this.stepMap = {
      order: <FormattedMessage id='modals.coinifyexchangedata.steps.order' defaultMessage='Order' />,
      verify: <FormattedMessage id='modals.coinifyexchangedata.steps.verify' defaultMessage='Verify' />,
      payment: <FormattedMessage id='modals.coinifyexchangedata.steps.payment' defaultMessage='Payment' />,
      submit: <FormattedMessage id='modals.coinifyexchangedata.steps.submit' defaultMessage='Submit' />
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
    return <Create />
    // switch (step) {
    //   case 'account': return <Create />
    //   case 'verify': return <Verify />
    //   case 'payment': return <Link />
    //   case 'verified': {
    //     this.handleClose()
    //     break
    //   }
    // }
  }

  render () {
    const { show } = this.state
    const step = this.props.signupStep || this.props.step

    return (
      <Tray in={show} class='tray' onClose={this.handleClose.bind(this)}>
        <ModalHeader onClose={this.handleClose.bind(this)}>
          <StepIndicator step={step} stepMap={this.stepMap} />
        </ModalHeader>
        <ModalBody>
          { this.getStepComponent(step) }
        </ModalBody>
      </Tray>
    )
  }
}

SfoxExchangeData.propTypes = {
  step: PropTypes.oneOf(['account', 'verify', 'order', 'payment']),
  close: PropTypes.function
}

const mapStateToProps = (state) => ({
  // data: getData(state),
  // signupStep: path(['coinifySignup', 'signupStep'], state)
})

const mapDispatchToProps = (dispatch) => ({
  // coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('CoinifyExchangeData')
)

export default enhance(SfoxExchangeData)
