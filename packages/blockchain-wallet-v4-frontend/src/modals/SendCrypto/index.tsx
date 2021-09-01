import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { reduxForm } from 'redux-form'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import CoinSelect from './CoinSelect'
import Confirm from './Confirm'
import EnterAmount from './EnterAmount'
import EnterTo from './EnterTo'
import { SEND_FORM } from './model'
import { getData } from './selectors'
import Status from './Status'
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
    this.props.sendCryptoActions.fetchWithdrawalFees()
    this.props.sendCryptoActions.fetchWithdrawalLocks()
  }

  componentWillUnmount() {
    this.props.sendCryptoActions.setStep({ step: SendCryptoStepType.COIN_SELECTION })
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
        {this.props.step === SendCryptoStepType.COIN_SELECTION && (
          <FlyoutChild>
            <CoinSelect {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === SendCryptoStepType.ENTER_TO && (
          <FlyoutChild>
            <EnterTo {...this.props} />
          </FlyoutChild>
        )}
        {this.props.step === SendCryptoStepType.ENTER_AMOUNT && (
          <FlyoutChild>
            <EnterAmount {...this.props} />
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
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  formErrors: selectors.form.getFormSyncErrors(SEND_FORM)(state),
  formValues: selectors.form.getFormValues(SEND_FORM)(state) as SendFormType,
  initialValues: {
    coin: state.components.sendCrypto.initialCoin,
    fix: 'CRYPTO'
  },
  sendableCoins: getData(),
  step: selectors.components.sendCrypto.getStep(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch),
  sendCryptoActions: bindActionCreators(actions.components.sendCrypto, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose<any>(
  ModalEnhancer(ModalName.SEND_CRYPTO_MODAL, { transition: duration }),
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
