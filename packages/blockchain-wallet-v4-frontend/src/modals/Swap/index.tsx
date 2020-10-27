import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions, selectors } from 'data'
import { ExtractSuccess, SwapOrderType } from 'core/types'
import { getData } from './selectors'
import { ModalPropsType } from '../types'
import { SwapStepType } from 'data/components/swap/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import ModalEnhancer from 'providers/ModalEnhancer'

import CoinSelection from './CoinSelection'
import EnterAmount from './EnterAmount'
import InitSwapForm from './InitSwapForm'
import OrderDetails from './OrderDetails'
import PreviewSwap from './PreviewSwap'

class Swap extends PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (SwapStepType[this.props.step] > SwapStepType[prevProps.step]) {
      /* eslint-disable */
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
      /* eslint-enable */
    }
  }

  componentWillUnmount () {
    this.props.swapActions.stopPollQuote()
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <Flyout
          {...this.props}
          in={this.state.show}
          direction={this.state.direction}
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
          {this.props.step === 'ENTER_AMOUNT' && (
            <FlyoutChild>
              <EnterAmount
                {...this.props}
                handleClose={this.handleClose}
                {...val}
              />
            </FlyoutChild>
          )}
          {this.props.step === 'PREVIEW_SWAP' && (
            <FlyoutChild>
              <PreviewSwap {...this.props} handleClose={this.handleClose} />
            </FlyoutChild>
          )}
          {this.props.step === 'ORDER_DETAILS' && (
            <FlyoutChild>
              <OrderDetails {...this.props} handleClose={this.handleClose} />
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
      step: 'PREVIEW_SWAP'
    }
  | {
      order?: SwapOrderType
      step: 'ORDER_DETAILS'
    }
) => ({
  order: selectors.components.swap.getOrder(state),
  step: selectors.components.swap.getStep(state),
  side: selectors.components.swap.getSide(state),
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer('SWAP_MODAL', { transition: duration }),
  connector
)

type OwnProps = {}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = ModalPropsType & OwnProps & ConnectedProps<typeof connector>
type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(Swap)
