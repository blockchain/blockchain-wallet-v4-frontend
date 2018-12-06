import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { keys, pickBy } from 'ramda'
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
  padding: 12px !important;
  > div {
    width: 100%;
    > div {
      width: 100%;
    }
  }
  & > :first-child {
    margin-right: 42px;
  }
`
const IdentityVerificationTray = styled(Tray)`
  margin-top: 0;
  border-radius: 0;
  > div:first-child {
    padding: 20px;
    > span:last-child {
      top: 18px;
      right: 12px;
    }
  }
  > div:last-child {
    overflow: hidden;
    padding: 0;
    height: calc(100% - 57px);
  }
`

const KycStepIndicator = styled(StepIndicator)`
  justify-content: space-between;
  span {
    display: none;
  }
  > img {
    margin-right: 10px;
    height: 32px;
  }
  > div {
    flex: 1;
    height: 8px;
    max-width: 840px;
    margin: auto;
    padding: 0;
    border-radius: 4px;
    border: none;
    background-color: ${props => props.theme['gray-2']};
    &:after {
      bottom: 0px;
      border-radius: 4px;
      background-color: ${props => props.theme['brand-secondary']};
    }
  }
`

const { STEPS, KYC_MODAL } = model.components.identityVerification

const stepMap = {
  [STEPS.personal]: (
    <FormattedMessage
      id='modals.identityverification.steps.personal'
      defaultMessage='Personal'
    />
  ),
  [STEPS.mobile]: (
    <FormattedMessage
      id='modals.identityverification.steps.mobile'
      defaultMessage='Phone'
    />
  ),
  [STEPS.verify]: (
    <FormattedMessage
      id='modals.identityverification.steps.verify'
      defaultMessage='Verify'
    />
  )
}

const filterSteps = smsVerified => (stepText, step) =>
  step !== STEPS.mobile || !smsVerified

class IdentityVerification extends React.PureComponent {
  state = { show: false }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    const { actions, smsVerified } = this.props
    actions.initializeStep()
    this.steps = pickBy(filterSteps(smsVerified), stepMap)
  }

  steps = {}

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  getStepComponent = step => {
    const { actions, modalActions, position, total } = this.props
    if (step === STEPS.personal)
      return <Personal handleSubmit={actions.savePersonalData} />

    if (step === STEPS.mobile)
      return (
        <VerifyMobile
          handleSubmit={actions.verifySmsNumber}
          onBack={actions.setVerificationStep.bind(null, STEPS.personal)}
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
          onBack={
            this.steps.mobile
              ? actions.setVerificationStep.bind(null, STEPS.mobile)
              : actions.setVerificationStep.bind(null, STEPS.personal)
          }
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
            <KycStepIndicator
              adjuster={0.1667}
              barFullWidth
              horizontalMobile
              flexEnd
              maxWidth='none'
              step={step}
              stepMap={this.steps}
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
