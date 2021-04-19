import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { ExtractSuccess, SwapOrderType } from 'blockchain-wallet-v4/src/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import CoinSelection from './CoinSelection'
import EnterAmount from './EnterAmount'
import InitSwapForm from './InitSwapForm'
import NoHoldings from './NoHoldings'
import OrderDetails from './OrderDetails'
import PreviewSwap from './PreviewSwap'
import { getData } from './selectors'
import SuccessfulSwap from './SuccessfulSwap'
import UpgradePrompt from './UpgradePrompt'

class Swap extends PureComponent<Props, State> {
  state: State = { show: false }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentWillUnmount() {
    this.props.swapActions.stopPollQuote()
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <Flyout
          {...this.props}
          isOpen={this.state.show}
          onClose={this.handleClose}
        >
          {this.props.step === 'INIT_SWAP' && (
            <FlyoutChild>
              <InitSwapForm
                {...this.props}
                handleClose={this.handleClose}
                {...val}
              />
            </FlyoutChild>
          )}
          {this.props.step === 'COIN_SELECTION' && (
            <FlyoutChild>
              <CoinSelection
                {...this.props}
                handleClose={this.handleClose}
                {...val}
              />
            </FlyoutChild>
          )}
          {this.props.step === 'NO_HOLDINGS' && (
            <FlyoutChild>
              <NoHoldings
                {...this.props}
                handleClose={this.handleClose}
                {...val}
              />
            </FlyoutChild>
          )}
          {this.props.step === 'ENTER_AMOUNT' && (
            <FlyoutChild>
              <EnterAmount
                {...this.props}
                handleClose={this.handleClose}
                {...val}
              />
            </FlyoutChild>
          )}
          {this.props.step === 'UPGRADE_PROMPT' && (
            <FlyoutChild>
              <UpgradePrompt
                {...this.props}
                handleClose={this.handleClose}
                {...val}
              />
            </FlyoutChild>
          )}
          {this.props.step === 'PREVIEW_SWAP' && (
            <FlyoutChild>
              <PreviewSwap
                {...this.props}
                handleClose={this.handleClose}
                {...val}
              />
            </FlyoutChild>
          )}
          {this.props.step === 'ORDER_DETAILS' && (
            <FlyoutChild>
              <OrderDetails
                {...this.props}
                handleClose={this.handleClose}
                {...val}
              />
            </FlyoutChild>
          )}
          {this.props.step === 'SUCCESSFUL_SWAP' && (
            <FlyoutChild>
              <SuccessfulSwap
                {...this.props}
                handleClose={this.handleClose}
                {...val}
              />
            </FlyoutChild>
          )}
        </Flyout>
      ),
      Failure: () => null,
      Loading: () => null,
      NotAsked: () => null
    })
  }
}

const mapStateToProps = (
  state: RootState
): { data: ReturnType<typeof getData> } & (
  | {
      step: 'INIT_SWAP'
    }
  | {
      side: 'BASE' | 'COUNTER'
      step: 'COIN_SELECTION'
    }
  | {
      step: 'ENTER_AMOUNT'
    }
  | {
      step: 'UPGRADE_PROMPT'
    }
  | {
      step: 'PREVIEW_SWAP'
    }
  | {
      order?: SwapOrderType
      step: 'ORDER_DETAILS'
    }
  | {
      order?: SwapOrderType
      step: 'SUCCESSFUL_SWAP'
    }
  | {
      step: 'NO_HOLDINGS'
    }
) => ({
  order: selectors.components.swap.getOrder(state),
  step: selectors.components.swap.getStep(state),
  side: selectors.components.swap.getSide(state),
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  idvActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer('SWAP_MODAL', { transition: duration }),
  connector
)

export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = ModalPropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(Swap)
