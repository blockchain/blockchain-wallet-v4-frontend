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
import { SEND_FORM } from './model'
import { getData } from './selectors'
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
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  formValues: selectors.form.getFormValues(SEND_FORM)(state) as SendFormType,
  sendableCoins: getData(),
  step: selectors.components.sendCrypto.getStep(state),
  walletCurrency: selectors.core.settings.getCurrency(state).getOrElse('USD')
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  sendCryptoActions: bindActionCreators(actions.components.sendCrypto, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose<any>(
  ModalEnhancer(ModalName.SEND_CRYPTO_MODAL, { transition: duration }),
  connector,
  reduxForm({
    enableReinitialize: true,
    form: SEND_FORM
  })
)

export type Props = ModalPropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(SendCrypto)
