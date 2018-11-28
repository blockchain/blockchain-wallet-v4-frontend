import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { contains, keys, pickBy, fromPairs, prepend, test } from 'ramda'
import { FormattedMessage } from 'react-intl'

import { actions, model } from 'data'
import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import media from 'services/ResponsiveService'
import { ModalHeader, ModalBody } from 'blockchain-info-components'
import Tray, { duration } from 'components/Tray'
import StepIndicator from 'components/StepIndicator'
import Personal from './Personal'
import VerifyMobile from './VerifyMobile'
import Verify from './Verify'

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`

const StepHeader = styled(ModalHeader)`
  > div {
    width: 100%;
    > div {
      width: 100%;
    }
  }
`
const IdentityVerificationTray = styled(Tray)`
  > div:first-child {
    padding: 20px;
  }
  > div:last-child {
    overflow: hidden;
    padding: 28px 50px;
    height: calc(100% - 91px);
    ${media.tablet`
      padding: 18px;
      height: calc(100% - 151px);
    `};
    ${media.mobile`
      padding: 18px;
      height: calc(100% - 215px);
    `};
  }
`

const { STEPS, KYC_MODAL } = model.components.identityVerification

const stepMap = (props) => {
  const coinifyStep = [
    STEPS.coinify,
    <FormattedMessage
      id='modals.identityverification.steps.coinify'
      defaultMessage='Email'
    />
  ]
  const baseSteps = [
    [
      STEPS.personal,
      <FormattedMessage
        id='modals.identityverification.steps.personal'
        defaultMessage='Personal'
      />
    ],
    [
      STEPS.mobile,
      <FormattedMessage
        id='modals.identityverification.steps.mobile'
        defaultMessage='Phone'
      />
    ],
    [
      STEPS.verify,
      <FormattedMessage
        id='modals.identityverification.steps.verify'
        defaultMessage='Verify'
      />
    ]
  ]
  if (test(/buy-sell/, props.path)) // if we're on buy-sell route, include coinify in stepMap
    return fromPairs(prepend(coinifyStep, baseSteps))
  return fromPairs(baseSteps)
}

class IdentityVerification extends React.PureComponent {
  state = { show: false }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    const { isCoinify, desiredTier } = this.props
    this.props.actions.initializeVerification(isCoinify, desiredTier)
  }

  getSteps = () =>
    pickBy((_, step) => contains(step, this.props.steps), stepMap)

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  getStepComponent = step => {
    const { actions, modalActions, position, total } = this.props
    if (step === STEPS.coinify)
      return <div>COINIFY EMAIL VERIFICATION</div>
    if (step === STEPS.personal)
      return (
        <Personal
          handleSubmit={actions.savePersonalData}
          onBack={actions.goToPrevStep}
        />
      )

    if (step === STEPS.mobile)
      return (
        <VerifyMobile
          handleSubmit={actions.verifySmsNumber}
          onBack={actions.goToPrevStep}
        />
      )

    if (step === STEPS.verify)
      return (
        <Verify
          handleSubmit={modalActions.showModal.bind(
            null,
            'Onfido',
            {
              position: position + 1,
              total: total + 1
            },
            {}
          )}
          onBack={actions.goToPrevStep}
        />
      )
  }

  render () {
    const { show } = this.state
    const { step, position, total } = this.props

    return (
      <IdentityVerificationTray
        in={show}
        class='tray'
        position={position}
        total={total}
        onClose={this.handleClose}
      >
        <StepHeader tray paddingHorizontal='15%' onClose={this.handleClose}>
          <HeaderWrapper>
            <StepIndicator
              adjuster={0.1667}
              barFullWidth
              flexEnd
              maxWidth='none'
              step={step}
              stepMap={this.getSteps()}
            />
          </HeaderWrapper>
        </StepHeader>
        <ModalBody>{this.getStepComponent(step)}</ModalBody>
      </IdentityVerificationTray>
    )
  }
}

IdentityVerification.propTypes = {
  step: PropTypes.oneOf(keys(STEPS)),
  close: PropTypes.func.isRequired
}

IdentityVerification.defaultProps = {
  step: STEPS.personal
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(
  modalEnhancer(KYC_MODAL),
  connect(
    getData,
    mapDispatchToProps
  )
)

export default enhance(IdentityVerification)
