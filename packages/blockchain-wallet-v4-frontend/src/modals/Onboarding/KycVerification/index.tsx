import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { RemoteDataType } from '@core/types'
import DataError from 'components/DataError'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, model } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import AdditionalInfo from './AdditionalInfo'
import EmailVerification from './EmailVerification'
import ExtraFields from './ExtraFields'
import MoreInfo from './MoreInfo'
import { getData } from './selectors'
import Submitted from './Submitted'
import Loading from './template.loading'
import UserAddress from './UserAddress'
import UserInfoDetails from './UserInfoDetails'
import Verify from './Verify'

const { STEPS } = model.components.identityVerification

type OwnProps = {
  checkSddEligibility?: boolean
  close: () => void
  context: string
  emailVerified: boolean
  needMoreInfo: boolean
  onCompletionCallback?: () => void
  origin: string
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

  componentWillUnmount() {
    this.props.actions.kycModalClosed()
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  initializeVerification = () => {
    const { context, needMoreInfo, origin, tier } = this.props
    this.props.actions.initializeVerification({ context, needMoreInfo, origin, tier })
  }

  getStepComponent = (emailVerified: boolean, step: string) => {
    if (step === STEPS.userDetails) {
      if (!emailVerified) {
        return <EmailVerification handleClose={this.handleClose} />
      }

      return <UserInfoDetails onClose={this.handleClose} />
    }

    if (step === STEPS.userAddress) {
      return <UserAddress onClose={this.handleClose} />
    }

    if (step === STEPS.moreInfo) {
      return <MoreInfo />
    }
    if (step === STEPS.addExtraStep) {
      return (
        <ExtraFields
          onClose={this.handleClose}
          onCompletionCallback={this.props.onCompletionCallback}
        />
      )
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
          doNotHide
        >
          <FlyoutChild>{this.getStepComponent(emailVerified, step)}</FlyoutChild>
        </Flyout>
      )
    })
  }
}

// @ts-ignore
IdentityVerification.defaultProps = {
  step: STEPS.userDetails
}

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const enhance = compose(
  modalEnhancer(ModalName.KYC_MODAL, { preventEscapeClose: true }),
  connect(getData, mapDispatchToProps)
)

export default enhance(IdentityVerification)
