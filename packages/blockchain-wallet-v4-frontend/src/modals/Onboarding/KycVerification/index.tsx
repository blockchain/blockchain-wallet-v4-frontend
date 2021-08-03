import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { includes, pickBy } from 'ramda'
import { bindActionCreators, compose } from 'redux'

import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, model } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import AdditionalInfo from './AdditionalInfo'
import EmailVerification from './EmailVerification'
import InfoAndResidential from './InfoAndResidential'
import MoreInfo from './MoreInfo'
import { getData } from './selectors'
import Submitted from './Submitted'
import Loading from './template.loading'
import Verify from './Verify'

const { STEPS } = model.components.identityVerification

const stepMap = {
  [STEPS.infoAndResidential]: (
    <FormattedMessage
      id='modals.identityverification.steps.info_and_residential'
      defaultMessage='Info and residential'
    />
  ),
  [STEPS.moreInfo]: (
    <FormattedMessage id='modals.identityverification.steps.more_info' defaultMessage='Info' />
  ),
  [STEPS.additionalInfo]: (
    <FormattedMessage
      id='modals.identityverification.steps.additional_info'
      defaultMessage='Additional Info'
    />
  ),
  [STEPS.verify]: (
    <FormattedMessage id='modals.identityverification.steps.verify' defaultMessage='Verify' />
  ),
  [STEPS.submitted]: (
    <FormattedMessage id='modals.identityverification.steps.submitted' defaultMessage='Submitted' />
  )
}

type OwnProps = {
  checkSddEligibility?: boolean
  close: () => void
  emailVerified: boolean
  needMoreInfo: boolean
  onCompletionCallback?: () => void
  position: number
  step: string
  steps: RemoteDataType<any, any>
  tier: number
  total: number
}

type LinkDispatchPropsType = {
  actions: typeof actions.components.identityVerification
}

type Props = OwnProps & LinkDispatchPropsType
type State = { show: boolean }

class IdentityVerification extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */

    this.initializeVerification()
  }

  getSteps = (steps) => pickBy((_, step) => includes(step, steps), stepMap)

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  initializeVerification = () => {
    const { needMoreInfo, tier } = this.props
    this.props.actions.initializeVerification(tier, needMoreInfo)
  }

  getStepComponent = (emailVerified: boolean, step: string) => {
    if (step === STEPS.infoAndResidential) {
      if (!emailVerified) {
        return <EmailVerification handleClose={this.handleClose} />
      }
      return (
        <InfoAndResidential
          checkSddEligibility={this.props.checkSddEligibility}
          onClose={this.handleClose}
          onCompletionCallback={this.props.onCompletionCallback}
        />
      )
    }

    if (step === STEPS.moreInfo) {
      return <MoreInfo />
    }
    if (step === STEPS.additionalInfo) {
      return <AdditionalInfo onClose={this.handleClose} />
    }
    if (step === STEPS.verify) {
      return <Verify onClose={this.handleClose} />
    }
    if (step === STEPS.submitted) {
      return <Submitted onClose={this.handleClose} />
    }
  }

  render() {
    const { show } = this.state
    const { emailVerified, step, steps } = this.props

    return steps.cata({
      Failure: (error) => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='identityVerificationModal'
        >
          <DataError onClick={this.initializeVerification} message={error} />
        </Flyout>
      ),
      Loading: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='identityVerificationModal'
        >
          <FlyoutChild>
            <Loading />
          </FlyoutChild>
        </Flyout>
      ),
      NotAsked: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='identityVerificationModal'
        >
          <Loading />
        </Flyout>
      ),
      Success: () => (
        <Flyout
          {...this.props}
          isOpen={show}
          onClose={this.handleClose}
          data-e2e='identityVerificationModal'
        >
          <FlyoutChild>{this.getStepComponent(emailVerified, step)}</FlyoutChild>
        </Flyout>
      )
    })
  }
}

// @ts-ignore
IdentityVerification.defaultProps = {
  step: STEPS.infoAndResidential
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const enhance = compose(
  modalEnhancer(ModalName.KYC_MODAL, { preventEscapeClose: true }),
  connect(getData, mapDispatchToProps)
)

export default enhance(IdentityVerification)
