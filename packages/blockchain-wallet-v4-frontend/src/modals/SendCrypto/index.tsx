import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { map } from 'ramda'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { reduxForm } from 'redux-form'

import { CrossBorderLimits } from '@core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import AccountSelect from './AccountSelect'
import CoinSelect from './CoinSelect'
import Confirm from './Confirm'
import EnterAmount from './EnterAmount'
import EnterAmountNew from './EnterAmountNew'
import EnterTo from './EnterTo'
import { SEND_FORM } from './model'
import NoFunds from './NoFunds'
import { getData } from './selectors'
import Status from './Status'
import TransactionOverview from './TransactionOverview'
import { SendFormType } from './types'

class SendCrypto extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    this.props.sendCryptoActions.initializeSend()

    this.props.sendCryptoActions.fetchWithdrawalFees({})
    this.props.sendCryptoActions.fetchWithdrawalLocks()
  }

  componentWillUnmount() {
    // this.props.sendCryptoActions.setStep({ step: SendCryptoStepType.COIN_SELECTION })
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    return (
      <Flyout {...this.props} isOpen={this.state.show} onClose={this.handleClose}>
        {this.props.step === SendCryptoStepType.NO_FUNDS && (
          <FlyoutChild>
            <NoFunds {...this.props} close={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === SendCryptoStepType.COIN_SELECTION && (
          <FlyoutChild>
            {this.props.showNewSendFlow ? (
              <AccountSelect {...this.props} close={this.handleClose} />
            ) : (
              <CoinSelect {...this.props} close={this.handleClose} />
            )}
          </FlyoutChild>
        )}
        {this.props.step === SendCryptoStepType.ENTER_TO && (
          <FlyoutChild>
            <EnterTo {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === SendCryptoStepType.ENTER_AMOUNT && (
          <FlyoutChild>
            {this.props.showNewSendFlow ? (
              <EnterAmountNew {...this.props} />
            ) : (
              <EnterAmount {...this.props} />
            )}
          </FlyoutChild>
        )}
        {this.props.step === SendCryptoStepType.CONFIRM && (
          <FlyoutChild>
            <Confirm {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === SendCryptoStepType.STATUS && (
          <FlyoutChild>
            <Status {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === SendCryptoStepType.TX_OVERVIEW && (
          <FlyoutChild>
            <TransactionOverview {...this.props} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  coinList: selectors.balances.getTotalWalletBalancesSorted(state).getOrElse([]),
  formErrors: selectors.form.getFormSyncErrors(SEND_FORM)(state),
  formValues: selectors.form.getFormValues(SEND_FORM)(state) as SendFormType,
  initialValues: {
    coin: state.components.sendCrypto.initialCoin,
    fee: 'LOW',
    fix: 'CRYPTO'
  },
  isValidAddress: selectors.components.sendCrypto.getIsValidAddress(state),
  sendLimits: selectors.components.sendCrypto
    .getSendLimits(state)
    .getOrElse({} as CrossBorderLimits),
  sendableCoins: getData(),
  showNewSendFlow: selectors.core.walletOptions
    .getNewSendFlowEnabled(state)
    .getOrElse(false) as boolean,
  step: selectors.components.sendCrypto.getStep(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  sendCryptoActions: bindActionCreators(actions.components.sendCrypto, dispatch),
  verifyIdentity: () =>
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'Send',
        tier: 2
      })
    )
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose<React.ComponentType>(
  ModalEnhancer(ModalName.SEND_CRYPTO_MODAL, { fixed: true, transition: duration }),
  connector,
  reduxForm({
    destroyOnUnmount: false,
    enableReinitialize: true,
    form: SEND_FORM
  })
)

export type Props = ModalPropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(SendCrypto)
