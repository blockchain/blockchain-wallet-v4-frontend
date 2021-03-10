import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { WalletFiatType } from 'blockchain-wallet-v4/src/types'
import DataError from 'components/DataError'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankDWStepType } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import { BROKERAGE_INELIGIBLE } from '../../components'
import BankList from './BankList'
import Confirm from './Confirm'
import DepositMethods from './DepositMethods'
import Loading from './DepositMethods/template.loading'
import DepositStatus from './DepositStatus'
import EnterAmount from './EnterAmount'
import WireInstructions from './WireInstructions'
class Deposit extends PureComponent<Props> {
  state: State = { show: false, direction: 'left' }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (BankDWStepType[this.props.step] > BankDWStepType[prevProps.step]) {
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

  render() {
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        in={this.state.show}
        direction={this.state.direction}
        data-e2e='bankDepositModal'
      >
        {this.props.step === BankDWStepType.LOADING && (
          <FlyoutChild>
            <Loading {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === BankDWStepType.DEPOSIT_METHODS && (
          /*
           * loads deposit payment methods ui
           * bank_transfer or loads wire transfer screen
           */
          <FlyoutChild>
            <DepositMethods {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === BankDWStepType.ENTER_AMOUNT && (
          /*
           * The enter amount form shows the amount input, limits, and default
           * or last used ach account. If user clicks on "Add a bank" or their
           * last used bank, transition to add bank modal or linked banks list ui
           */
          <FlyoutChild>
            <EnterAmount {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === BankDWStepType.BANK_LIST && (
          /*
           * list a users saved bank accounts if they have more than one and
           * add show an "add new" button which transitions them to a payment
           * method selection screen
           */
          <FlyoutChild>
            <BankList
              fiatCurrency={this.props.fiatCurrency as WalletFiatType}
              handleClose={this.handleClose}
            />
          </FlyoutChild>
        )}
        {this.props.step === BankDWStepType.CONFIRM && (
          /*
           * this step shows a confirmation screen for a created deposit with
           * the option to confirm or cancel the order
           */
          <FlyoutChild>
            <Confirm {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === BankDWStepType.DEPOSIT_STATUS && (
          /*
           * depending on the servers response we'll display a successful
           * or unsuccessful deposit screen9
           */
          <FlyoutChild>
            <DepositStatus {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === BankDWStepType.WIRE_INSTRUCTIONS && (
          <FlyoutChild>
            <WireInstructions {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === BankDWStepType.INELIGIBLE && (
          <FlyoutChild>
            <DataError message={{ message: BROKERAGE_INELIGIBLE }} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.brokerage.getDWStep(state),
  fiatCurrency: selectors.components.brokerage.getFiatCurrency(state)
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
  step: BankDWStepType
}
export type FailurePropsType = {
  handleClose: () => void
}

export type Props = OwnProps &
  LinkStatePropsType &
  ConnectedProps<typeof connector>

type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(Deposit)
