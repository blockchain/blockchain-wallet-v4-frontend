import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { WalletFiatType } from '@core/types'
import DataError from 'components/DataError'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankDWStepType, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { BROKERAGE_INELIGIBLE, Loading, LoadingTextEnum } from '../../../components'
import Rejected from '../../../components/Rejected'
import { ModalPropsType } from '../../../types'
import Authorize from './Authorize'
import BankList from './BankList'
import Confirm from './Confirm'
import DepositMethods from './DepositMethods'
import DepositStatus from './DepositStatus'
import EnterAmount from './EnterAmount'
import OpenBankingConnect from './OpenBankingConnect'
import getData from './selectors'
import WireInstructions from './WireInstructions'

class Deposit extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  render() {
    return this.props.data.cata({
      Failure: () => null,
      Loading: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='bankDepositModal'
        >
          <Loading {...this.props} text={LoadingTextEnum.LOADING} />
        </Flyout>
      ),
      NotAsked: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='bankDepositModal'
        >
          <Loading {...this.props} text={LoadingTextEnum.LOADING} />
        </Flyout>
      ),
      Success: (val) => {
        const { userData } = val
        const { kycState } = userData
        const isUserRejectedOrExpired = kycState === 'REJECTED' || kycState === 'EXPIRED'

        return isUserRejectedOrExpired ? (
          <Flyout
            {...this.props}
            onClose={this.handleClose}
            isOpen={this.state.show}
            data-e2e='bankDepositModal'
          >
            <Rejected handleClose={this.handleClose} />
          </Flyout>
        ) : (
          <Flyout
            {...this.props}
            onClose={this.handleClose}
            isOpen={this.state.show}
            data-e2e='bankDepositModal'
          >
            <FlyoutChild>
              {this.props.step === BankDWStepType.LOADING && (
                <Loading {...this.props} text={LoadingTextEnum.LOADING} />
              )}
              {this.props.step === BankDWStepType.DEPOSIT_METHODS && (
                /*
                 * loads deposit payment methods ui
                 * bank_transfer or loads wire transfer screen
                 */

                <DepositMethods {...this.props} />
              )}
              {this.props.step === BankDWStepType.ENTER_AMOUNT && (
                /*
                 * The enter amount form shows the amount input, limits, and default
                 * or last used ach account. If user clicks on "Add a bank" or their
                 * last used bank, transition to add bank modal or linked banks list ui
                 */

                <EnterAmount {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === BankDWStepType.AUTHORIZE && (
                /*
                 * After user already has a bank linked and then enters amount to deposit,
                 * they need to authorize each individual payment. User is then taken to the
                 * confirm step
                 */

                <Authorize {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === BankDWStepType.BANK_LIST && (
                /*
                 * list a users saved bank accounts if they have more than one and
                 * add show an "add new" button which transitions them to a payment
                 * method selection screen
                 */

                <BankList
                  fiatCurrency={this.props.fiatCurrency as WalletFiatType}
                  handleClose={this.handleClose}
                />
              )}
              {this.props.step === BankDWStepType.CONFIRM && (
                /*
                 * this step shows a confirmation screen for a created deposit with
                 * the option to confirm or cancel the order
                 */

                <Confirm {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === BankDWStepType.DEPOSIT_STATUS && (
                /*
                 * depending on the servers response we'll display a successful
                 * or unsuccessful deposit screen9
                 */

                <DepositStatus {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === BankDWStepType.WIRE_INSTRUCTIONS && (
                <WireInstructions {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === BankDWStepType.DEPOSIT_CONNECT && (
                <OpenBankingConnect {...this.props} handleClose={this.handleClose} />
              )}
              {this.props.step === BankDWStepType.INELIGIBLE && (
                <DataError message={{ message: BROKERAGE_INELIGIBLE }} />
              )}
            </FlyoutChild>
          </Flyout>
        )
      }
    })
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state),
  fiatCurrency: selectors.components.brokerage.getFiatCurrency(state),
  step: selectors.components.brokerage.getDWStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  brokerageActions: bindActionCreators(actions.components.brokerage, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.BANK_DEPOSIT_MODAL, { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  step: BankDWStepType
}

export type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>

type State = { show: boolean }

export default enhance(Deposit)
