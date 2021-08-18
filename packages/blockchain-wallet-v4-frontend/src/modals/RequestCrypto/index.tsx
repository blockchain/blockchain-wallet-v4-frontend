import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import { CoinType, FiatType, WalletCurrencyType } from 'blockchain-wallet-v4/src/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import RequestCoinSelect from './CoinSelect'
import InitTradingAccount from './InitTradingAccount'
import { REQUEST_FORM } from './model'
import { getData } from './selectors'
import RequestShowAddress from './ShowAddress'
import { RequestFormType, RequestSteps } from './types'

class RequestCrypto extends PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentWillUnmount() {
    this.setStep(RequestSteps.COIN_SELECT)
  }

  setStep = (step: RequestSteps) => {
    this.props.formActions.change(REQUEST_FORM, 'step', step)
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    const { formValues, position, total, userClickedOutside } = this.props
    const { step } = formValues || {}
    const { show } = this.state

    return (
      <Flyout
        position={position}
        isOpen={show}
        userClickedOutside={userClickedOutside}
        onClose={this.handleClose}
        data-e2e='requestCryptoModal'
        total={total}
      >
        {step === RequestSteps.COIN_SELECT && (
          <FlyoutChild>
            <RequestCoinSelect
              {...this.props}
              handleClose={this.handleClose}
              setStep={this.setStep}
            />
          </FlyoutChild>
        )}
        {step === RequestSteps.SHOW_ADDRESS && (
          <FlyoutChild>
            <RequestShowAddress
              {...this.props}
              handleClose={this.handleClose}
              setStep={this.setStep}
            />
          </FlyoutChild>
        )}
        {step === RequestSteps.IDV_INTRO && (
          <FlyoutChild>
            <InitTradingAccount
              {...this.props}
              handleClose={this.handleClose}
              setStep={this.setStep}
            />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  formValues: selectors.form.getFormValues(REQUEST_FORM)(state) as RequestFormType,
  initialValues: {
    currencyDisplay: selectors.core.settings.getCurrency(state).getOrElse('USD'),
    selectedCoin: selectors.router.getCoinFromPageUrl(state) || 'ALL',
    step: RequestSteps.COIN_SELECT
  },
  requestableCoins: getData(),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type State = {
  show: boolean
}
type OwnProps = ModalPropsType & { coin?: CoinType }
type LinkStatePropsType = {
  formValues: RequestFormType
  initialValues: {
    currencyDisplay: WalletCurrencyType
    selectedCoin: CoinType | string | undefined
    step: RequestSteps
  }
  requestableCoins: Array<string>
  walletCurrency: FiatType
}
export type Props = OwnProps &
  InjectedFormProps &
  LinkStatePropsType &
  ConnectedProps<typeof connector>

// 👋 Order of composition is important, do not change!
const enhance = compose<any>(
  modalEnhancer(ModalName.REQUEST_CRYPTO_MODAL, { transition: duration }),
  connector,
  reduxForm({
    enableReinitialize: true,
    form: REQUEST_FORM
  })
)

export default enhance(RequestCrypto)
