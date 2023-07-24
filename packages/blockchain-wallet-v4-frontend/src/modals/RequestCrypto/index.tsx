import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { InjectedFormProps, reduxForm } from 'redux-form'

import { CoinType, FiatType, WalletCurrencyType } from '@core/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { ModalName, SwapAccountType } from 'data/types'
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
    // eslint-disable-next-line
    this.setState({ show: true })
    this.props.custodialActions.fetchProductEligibilityForUser()
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
    const requestProps = {
      ...this.props,
      handleClose: this.handleClose,
      setStep: this.setStep
    }

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
            <RequestCoinSelect {...requestProps} />
          </FlyoutChild>
        )}
        {step === RequestSteps.SHOW_ADDRESS && (
          <FlyoutChild>
            <RequestShowAddress {...requestProps} />
          </FlyoutChild>
        )}
        {step === RequestSteps.IDV_INTRO && (
          <FlyoutChild>
            <InitTradingAccount {...requestProps} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state, ownProps): LinkStatePropsType => {
  let coinSearch
  const currencyDisplay = selectors.core.settings.getCurrency(state).getOrElse('USD')

  // if user is on a transactions page for coin, preselect that coin in request
  const coinFromUrl = selectors.router.getCoinFromPageUrl(state)
  if (coinFromUrl) {
    coinSearch = window.coins[coinFromUrl].coinfig.name
  }

  // other parts of the app may want to open request modal with a coin preset
  const coinFromExternal = ownProps?.preselectedCoin
  if (coinFromExternal) {
    coinSearch = window.coins[coinFromExternal].coinfig.name
  }

  return {
    formValues: selectors.form.getFormValues(REQUEST_FORM)(state) as RequestFormType,
    initialValues: {
      coinSearch,
      currencyDisplay,
      selectedAccount: ownProps?.account,
      step:
        ownProps?.account && ownProps?.coin ? RequestSteps.SHOW_ADDRESS : RequestSteps.COIN_SELECT
    },
    requestableCoins: getData(),
    walletCurrency: currencyDisplay
  }
}

const mapDispatchToProps = (dispatch) => ({
  custodialActions: bindActionCreators(actions.custodial, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type State = {
  show: boolean
}
type OwnProps = ModalPropsType & { account?: SwapAccountType; coin?: CoinType }
type LinkStatePropsType = {
  formValues: RequestFormType
  initialValues: {
    coinSearch?: string
    currencyDisplay: WalletCurrencyType
    selectedAccount: SwapAccountType
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
const enhance = compose<React.ComponentType>(
  modalEnhancer(ModalName.REQUEST_CRYPTO_MODAL, { transition: duration }),
  connector,
  reduxForm({
    enableReinitialize: true,
    form: REQUEST_FORM
  })
)

export default enhance(RequestCrypto)
