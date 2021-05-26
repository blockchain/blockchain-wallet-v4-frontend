import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

// import { ExtractSuccess, SwapOrderType } from 'blockchain-wallet-v4/src/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalNamesEnum, RecurringBuysStepType } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'

class RecurringBuys extends PureComponent<Props, State> {
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
        {this.props.step === RecurringBuysStepType.INIT_PAGE && <FlyoutChild>step 1</FlyoutChild>}
        {/* {this.props.step === 'COIN_SELECTION' && (
          <FlyoutChild>
            <CoinSelection {...this.props} handleClose={this.handleClose} {...val} />
          </FlyoutChild>
        )} */}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.recurringBuys.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalNamesEnum.RECURRING_BUYS_MODAL, { transition: duration }),
  connector
)

// export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = ModalPropsType & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(RecurringBuys)
