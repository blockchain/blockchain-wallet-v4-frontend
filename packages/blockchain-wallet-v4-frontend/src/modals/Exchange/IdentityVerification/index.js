import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { contains, keys, pickBy } from 'ramda'
import { FormattedMessage } from 'react-intl'

import { actions, model } from 'data'
import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import media from 'services/ResponsiveService'
import { ModalHeader, ModalBody } from 'blockchain-info-components'
import Tray, { duration } from 'components/Tray'
import StepIndicator from 'components/StepIndicator'
import DataError from 'components/DataError'
import Loading from './template.loading'
import Personal from './Personal'
import VerifyMobile from './VerifyMobile'
import Verify from './Verify'
import MoreInfo from './MoreInfo'

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
      top: 0;
      right: 0;
      margin: 20px;
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
    margin-left: 0;
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
  [STEPS.moreInfo]: (
    <FormattedMessage
      id='modals.identityverification.steps.more_info'
      defaultMessage='Info'
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

class IdentityVerification extends React.PureComponent {
  state = { show: false }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    this.initializeVerification()
  }

  getSteps = steps => pickBy((_, step) => contains(step, steps), stepMap)

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  initializeVerification = () => {
    const { tier, isCoinify, needMoreInfo } = this.props
    this.props.actions.initializeVerification(tier, isCoinify, needMoreInfo)
  }

  getStepComponent = step => {
    const { actions } = this.props
    if (step === STEPS.personal)
      return (
        <Personal
          handleSubmit={actions.savePersonalData}
          onBack={actions.goToPrevStep}
        />
      )

    if (step === STEPS.moreInfo) return <MoreInfo />

    if (step === STEPS.mobile)
      return (
        <VerifyMobile
          handleSubmit={actions.verifySmsNumber}
          onBack={actions.goToPrevStep}
        />
      )

    if (step === STEPS.verify) return <Verify onBack={actions.goToPrevStep} />
  }

  render () {
    const { show } = this.state
    const { step, steps, position, total } = this.props

    return (
      <IdentityVerificationTray
        in={show}
        class='tray'
        position={position}
        total={total}
        onClose={this.handleClose}
        data-e2e='identityVerificationModal'
      >
        {steps.cata({
          Success: steps => (
            <React.Fragment>
              <StepHeader
                tray
                paddingHorizontal='15%'
                onClose={this.handleClose}
              >
                <HeaderWrapper>
                  <KycStepIndicator
                    adjuster={0.1667}
                    barFullWidth
                    horizontalMobile
                    flexEnd
                    maxWidth='none'
                    step={step}
                    stepMap={this.getSteps(steps)}
                  />
                </HeaderWrapper>
              </StepHeader>
              <ModalBody>{this.getStepComponent(step)}</ModalBody>
            </React.Fragment>
          ),
          Loading: () => <Loading />,
          NotAsked: () => <Loading />,
          Failure: () => <DataError onClick={this.initializeVerification} />
        })}
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
  actions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const enhance = compose(
  modalEnhancer(KYC_MODAL, { preventEscapeClose: true }),
  connect(
    getData,
    mapDispatchToProps
  )
)

export default enhance(IdentityVerification)
