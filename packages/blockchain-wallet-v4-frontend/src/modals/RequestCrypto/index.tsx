import { compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import React, { PureComponent } from 'react'

import { CoinType, WalletCurrencyType } from 'core/types'
import Flyout, { duration, FlyoutChild, FlyoutWrapper } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'
import { Header } from './components'
import { ModalPropsType } from '../types'
import RequestCoinSelect from './CoinSelect'

enum RequestSteps {
  'COIN_SELECT',
  'SHOW_ADDRESS'
}

class RequestCrypto extends PureComponent<Props, State> {
  state: State = {
    direction: 'left',
    show: false,
    step: 'COIN_SELECT'
  }

  componentDidMount () {
    // eslint-disable-next-line
    this.setState({ show: true, step: 'COIN_SELECT' })
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    const { step } = this.state
    if (step === prevState.step) return
    /* eslint-disable */
    if (RequestSteps[step] > RequestSteps[prevState.step]) {
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
    }
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render () {
    const {
      coin,
      position,
      requestableCoins,
      userClickedOutside,
      total
    } = this.props
    const { direction, show, step } = this.state

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
        {step === 'COIN_SELECT' && (
          <FlyoutChild>
            <FlyoutWrapper>
              <Header handleClose={this.handleClose} />
              <RequestCoinSelect
                coin={coin}
                requestableCoins={requestableCoins}
              />
            </FlyoutWrapper>
          </FlyoutChild>
        )}
        {step === 'SHOW_ADDRESS' && (
          <FlyoutChild>
            <FlyoutWrapper>
              <Header handleClose={this.handleClose} />
              <h1>Share</h1>
              <button onClick={() => this.setState({ step: 'COIN_SELECT' })}>
                Back
              </button>
            </FlyoutWrapper>
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  requestableCoins: getData(state)
})

const connector = connect(mapStateToProps)

type State = {
  direction: 'left' | 'right'
  show: boolean
  step: string
}
type OwnProps = ModalPropsType & { coin?: CoinType }
type LinkStatePropsType = {
  requestableCoins: Array<WalletCurrencyType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose<any>(
  modalEnhancer('REQUEST_CRYPTO_MODAL', { transition: duration }),
  connector
)

export default enhance(RequestCrypto)
