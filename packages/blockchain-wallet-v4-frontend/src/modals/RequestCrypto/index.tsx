import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import {
  CoinType,
  FiatType,
  SupportedWalletCurrenciesType,
  WalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import RequestBuildLink from './BuildLink'
import RequestCoinSelect from './CoinSelect'
import { REQUEST_FORM } from './model'
import { getData } from './selectors'
import RequestShareLink from './ShareLink'
import RequestShowAddress from './ShowAddress'
import { RequestFormType, RequestSteps } from './types'

class RequestCrypto extends PureComponent<Props, State> {
  state: State = {
    direction: 'left',
    show: false
  }

  componentDidMount() {
    // eslint-disable-next-line
    this.setState({ show: true })
  }

  componentDidUpdate(prevProps: Props) {
    const newStep = this.props.formValues?.step
    const previousStep = prevProps.formValues?.step

    if (newStep === previousStep) return
    /* eslint-disable */
    if (newStep > previousStep) {
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
    }
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
    const { direction, show } = this.state

    return (
      <Flyout
        position={position}
        in={show}
        direction={direction}
        userClickedOutside={userClickedOutside}
        onClose={this.handleClose}
        data-e2e='requestCryptoModal'
        total={total}
      >
        {step === RequestSteps.COIN_SELECT && (
          <FlyoutChild>
            <RequestCoinSelect {...this.props} handleClose={this.handleClose} />
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
        {step === RequestSteps.BUILD_LINK && (
          <FlyoutChild>
            <RequestBuildLink {...this.props} setStep={this.setStep} />
          </FlyoutChild>
        )}
        {step === RequestSteps.SHARE_LINK && (
          <FlyoutChild>
            <RequestShareLink
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
  formValues: selectors.form.getFormValues(REQUEST_FORM)(
    state
  ) as RequestFormType,
  initialValues: {
    currencyDisplay: selectors.core.settings
      .getCurrency(state)
      .getOrElse('USD'),
    selectedCoin: selectors.router.getCoinFromPageUrl(state) || 'ALL',
    step: RequestSteps.COIN_SELECT
  },
  requestableCoins: getData(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = dispatch => ({
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type State = {
  direction: 'left' | 'right'
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
  requestableCoins: Array<WalletCurrencyType>
  supportedCoins: SupportedWalletCurrenciesType
  walletCurrency: FiatType
}
export type Props = OwnProps &
  InjectedFormProps &
  LinkStatePropsType &
  ConnectedProps<typeof connector>

// 👋 Order of composition is important, do not change!
const enhance = compose<any>(
  modalEnhancer('REQUEST_CRYPTO_MODAL', { transition: duration }),
  connector,
  reduxForm({
    form: REQUEST_FORM,
    enableReinitialize: true
  })
)

export default enhance(RequestCrypto)
