import { bindActionCreators, compose } from 'redux'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { includes, pickBy } from 'ramda'
import React from 'react'

import { actions, model } from 'data'
import { getData } from './selectors'
import { RemoteDataType } from 'core/types'
import { StepsMetadataType } from 'data/components/identityVerification/types'
import AdditionalInfo from './AdditionalInfo'
import DataError from 'components/DataError'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import InfoAndResidential from './InfoAndResidential'
import Loading from './template.loading'
import modalEnhancer from 'providers/ModalEnhancer'
import MoreInfo from './MoreInfo'
import Submitted from './Submitted'
import Verify from './Verify'

const { STEPS, KYC_MODAL } = model.components.identityVerification

const stepMap = {
  [STEPS.infoAndResidential]: (
    <FormattedMessage
      id='modals.identityverification.steps.info_and_residential'
      defaultMessage='Info and residential'
    />
  ),
  [STEPS.moreInfo]: (
    <FormattedMessage
      id='modals.identityverification.steps.more_info'
      defaultMessage='Info'
    />
  ),
  [STEPS.additionalInfo]: (
    <FormattedMessage
      id='modals.identityverification.steps.additional_info'
      defaultMessage='Additional Info'
    />
  ),
  [STEPS.verify]: (
    <FormattedMessage
      id='modals.identityverification.steps.verify'
      defaultMessage='Verify'
    />
  ),
  [STEPS.submitted]: (
    <FormattedMessage
      id='modals.identityverification.steps.submitted'
      defaultMessage='Submitted'
    />
  )
}

type OwnProps = {
  close: () => void
  metadata: StepsMetadataType
  needMoreInfo: boolean
  position: number
  step: number
  steps: RemoteDataType<any, any>
  tier: number
  total: number
}

type LinkDispatchPropsType = {
  actions: typeof actions.components.identityVerification
}

type Props = OwnProps & LinkDispatchPropsType
type State = { direction: 'left' | 'right'; show: boolean }

class IdentityVerification extends React.PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    this.initializeVerification()
  }

  getSteps = steps => pickBy((_, step) => includes(step, steps), stepMap)

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  initializeVerification = () => {
    const { tier, needMoreInfo } = this.props
    this.props.actions.initializeVerification(tier, needMoreInfo)
  }

  getStepComponent = step => {
    const { actions } = this.props

    if (step === STEPS.infoAndResidential)
      return (
        <InfoAndResidential
          onClose={this.handleClose}
          metadata={this.props.metadata}
        />
      )

    if (step === STEPS.moreInfo) {
      return <MoreInfo />
    }
    if (step === STEPS.additionalInfo) {
      return <AdditionalInfo onClose={this.handleClose} />
    }
    if (step === STEPS.verify) {
      return <Verify onBack={actions.goToPrevStep} onClose={this.handleClose} />
    }
    if (step === STEPS.submitted) {
      return <Submitted onClose={this.handleClose} />
    }
  }

  render () {
    const { show } = this.state
    const { step, steps } = this.props

    return steps.cata({
      Success: () => (
        <Flyout
          {...this.props}
          in={show}
          onClose={this.handleClose}
          direction={this.state.direction}
          data-e2e='identityVerificationModal_new'
        >
          <FlyoutChild>{this.getStepComponent(step)}</FlyoutChild>
        </Flyout>
      ),
      Loading: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='identityVerificationModal_flyout'
        >
          <FlyoutChild>
            loading inside main
            <Loading />
          </FlyoutChild>
        </Flyout>
      ),
      NotAsked: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='identityVerificationModal_flyout'
        >
          <Loading />
        </Flyout>
      ),
      Failure: error => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='identityVerificationModal_flyout'
        >
          <DataError onClick={this.initializeVerification} message={error} />
        </Flyout>
      )
    })
  }
}

// @ts-ignore
IdentityVerification.defaultProps = {
  step: STEPS.infoAndResidential
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const enhance = compose(
  modalEnhancer(KYC_MODAL, { preventEscapeClose: true }),
  connect(getData, mapDispatchToProps)
)

export default enhance(IdentityVerification)
