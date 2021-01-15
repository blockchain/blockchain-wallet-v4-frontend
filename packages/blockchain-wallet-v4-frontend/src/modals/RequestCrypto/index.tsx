import { bindActionCreators, compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { reduxForm } from 'redux-form'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import {
  CoinType,
  FiatType,
  SupportedWalletCurrenciesType,
  WalletCurrencyType
} from 'core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'
import { ModalPropsType } from '../types'
import { REQUEST_FORM } from './model'
import { RequestFormType, RequestSteps } from './types'
import RequestCoinSelect from './CoinSelect'
import RequestShowAddress from './ShowAddress'

class RequestCrypto extends PureComponent<Props, State> {
  state: State = {
    direction: 'left',
    show: false
  }

  componentDidMount () {
    // eslint-disable-next-line
    this.setState({ show: true })
  }

  componentDidUpdate (prevProps: Props) {
    const newStep = this.props.formValues?.step
    const previousStep = prevProps.formValues?.step

    if (newStep === previousStep) return
    /* eslint-disable */
    if (RequestSteps[newStep] > RequestSteps[previousStep]) {
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
    }
    /* eslint-enable */
  }

  componentWillUnmount () {
    this.goToCoinSelectStep()
  }

  goToCoinSelectStep = () => {
    this.props.formActions.change(
      REQUEST_FORM,
      'step',
      RequestSteps.COIN_SELECT
    )
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render () {
    const { formValues, position, userClickedOutside, total } = this.props
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
              handleBack={this.goToCoinSelectStep}
            />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

// TODO: fix form dropdown
const mapStateToProps = (state): LinkStatePropsType => ({
  formValues: selectors.form.getFormValues(REQUEST_FORM)(
    state
  ) as RequestFormType,
  initialValues: {
    selectedCoin: 'ALL', // selectors.router.getCoinFromPageUrl(state) || 'ALL',
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
    selectedCoin: CoinType | string | undefined
    step: RequestSteps
  }
  requestableCoins: Array<WalletCurrencyType>
  supportedCoins: SupportedWalletCurrenciesType
  walletCurrency: FiatType
}
export type Props = OwnProps &
  LinkStatePropsType &
  ConnectedProps<typeof connector>

const enhance = compose<any>(
  connector,
  modalEnhancer('REQUEST_CRYPTO_MODAL', { transition: duration }),
  reduxForm({
    form: REQUEST_FORM,
    enableReinitialize: true
  })
)

export default enhance(RequestCrypto)
