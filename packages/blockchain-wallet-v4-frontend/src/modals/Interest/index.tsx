import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import { InterestStep, InterestSteps } from 'data/types'
import { RootState } from 'data/rootReducer'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import AccountSummary from './AccountSummary'
import DepositForm from './DepositForm'
import DepositSuccess from './DepositSuccess'
import WithdrawalForm from './WithdrawalForm'

class Interest extends PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    this.setState({ show: true }) //eslint-disable-line
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (InterestSteps[this.props.step] > InterestSteps[prevProps.step]) {
      /* eslint-disable */
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
      /* eslint-enable */
    }
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  handleSBClick = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
      this.props.simpleBuyActions.showModal('sideNav')
    }, duration / 2)
  }

  render () {
    const { step, position, total } = this.props
    return (
      <Flyout
        position={position}
        in={this.state.show}
        direction={this.state.direction}
        userClickedOutside={this.props.userClickedOutside}
        onClose={this.handleClose}
        data-e2e='interestModal'
        total={total}
      >
        {step === 'ACCOUNT_SUMMARY' && (
          <FlyoutChild>
            <AccountSummary
              handleClose={this.handleClose}
              handleSBClick={this.handleSBClick}
            />
          </FlyoutChild>
        )}
        {step === 'DEPOSIT' && (
          <FlyoutChild>
            <DepositForm />
          </FlyoutChild>
        )}
        {step === 'DEPOSIT_SUCCESS' && (
          <FlyoutChild>
            <DepositSuccess handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {step === 'WITHDRAWAL' && (
          <FlyoutChild>
            <WithdrawalForm handleClose={this.handleClose} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  step: selectors.components.interest.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  step: InterestStep
}

type State = { direction: 'left' | 'right'; show: boolean }
type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose<any>(
  modalEnhancer('INTEREST_MODAL', { transition: duration }),
  connector
)

export default enhance(Interest)
