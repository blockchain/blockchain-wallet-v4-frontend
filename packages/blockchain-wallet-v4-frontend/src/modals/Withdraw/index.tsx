import { compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { selectors } from 'data'
import { WalletFiatType } from 'core/types'
// import { getData } from './selectors'
import { ModalPropsType } from '../types'
import { WithdrawStepEnum } from 'data/types'
import EnterAmount from './EnterAmount'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import ModalEnhancer from 'providers/ModalEnhancer'

class Withdraw extends PureComponent<Props> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (WithdrawStepEnum[this.props.step] > WithdrawStepEnum[prevProps.step]) {
      /* eslint-disable */
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
      /* eslint-enable */
    }
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render () {
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        in={this.state.show}
        direction={this.state.direction}
        data-e2e='custodyWithdrawModal'
      >
        {this.props.step === 'ENTER_AMOUNT' && (
          <FlyoutChild>
            <EnterAmount {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  fiatCurrency: selectors.components.withdraw.getFiatCurrency(state),
  step: selectors.components.withdraw.getStep(state)
  // data: getData(state)
})

const mapDispatchToProps = () => ({})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer('CUSTODY_WITHDRAW_MODAL', { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  fiatCurrency: WalletFiatType
  step: 'ENTER_AMOUNT'
}
// export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = OwnProps & ConnectedProps<typeof connector>
type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(Withdraw)
