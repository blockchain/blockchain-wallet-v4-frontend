import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import {
  AddBankStepType,
  BankDepositStepType,
  BrokerageModalOriginType
} from 'data/types'
import { FiatType, SBPaymentMethodType } from 'core/types'
import { ModalPropsType } from '../../../types'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import ModalEnhancer from 'providers/ModalEnhancer'

import Confirm from './Confirm'
import DepositMethods from './DepositMethods'
import DepositStatus from './DepositStatus'
import EnterAmount from './EnterAmount'

class Deposit extends PureComponent<Props> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (
      BankDepositStepType[this.props.step] > BankDepositStepType[prevProps.step]
    ) {
      /* eslint-disable */
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
      /* eslint-enable */
    }
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  handleBack = () => {}
  handleFailure = () => {}
  handleSubmit = (method: SBPaymentMethodType) => {
    switch (method.type) {
      case 'LINK_BANK':
        this.props.brokerageActions.setStep({
          step: AddBankStepType.ADD_BANK
        })
        this.props.brokerageActions.showModal(
          BrokerageModalOriginType.ADD_BANK,
          'ADD_BANK_MODAL'
        )
        break

      default:
        break
    }
  }

  render () {
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        in={this.state.show}
        direction={this.state.direction}
        data-e2e='bankDepositModal'
      >
        {this.props.step === BankDepositStepType.DEPOSIT_METHODS && (
          /*
           * loads deposit payment methods ui
           * bank_transfer or loads wire transfer screen
           */
          <FlyoutChild>
            <DepositMethods {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === BankDepositStepType.ENTER_AMOUNT && (
          /*
           * The enter amount form shows the amount input, limits, and default
           * or last used ach account. If user clicks on "Add a bank" or their
           * last used bank, transition to add bank modal or linked banks list ui
           */
          <FlyoutChild>
            <EnterAmount {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === BankDepositStepType.BANK_LIST && (
          /*
           * list a users saved bank accounts if they have more than one and
           * add show an "add new" button which transitions them to a payment
           * method selection screen
           */
          <FlyoutChild />
        )}
        {this.props.step === BankDepositStepType.CONFIRM && (
          /*
           * this step shows a confirmation screen for a created deposit with
           * the option to confirm or cancel the order
           */
          <FlyoutChild>
            <Confirm {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === BankDepositStepType.DEPOSIT_STATUS && (
          /*
           * depending on the servers response we'll display a successful
           * or unsuccessful deposit screen9
           */
          <FlyoutChild>
            <DepositStatus {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.brokerage.getStep(state),
  fiatCurrency: 'USD' as FiatType // TODO: Unhardcode this
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer('BANK_DEPOSIT_MODAL', { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  step: BankDepositStepType
}
export type FailurePropsType = {
  handleClose: () => void
}

export type Props = OwnProps &
  LinkStatePropsType &
  ConnectedProps<typeof connector>

type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(Deposit)
