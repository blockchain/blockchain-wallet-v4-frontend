import { compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { BankDepositStepType } from 'data/types'
import { FiatType } from 'core/types'
import { ModalPropsType } from '../../../types'
import { selectors } from 'data'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import ModalEnhancer from 'providers/ModalEnhancer'

import PaymentMethods from '../../PaymentMethods'

class Deposit extends PureComponent<Props> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (
      BankDepositStepType[this.props.step] > BankDepositStepType[prevProps.step]
    ) {
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

  handleBack = () => {}
  handleFailure = () => {}

  render () {
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        in={this.state.show}
        direction={this.state.direction}
        data-e2e='bankDepositModal'
      >
        {this.props.step === BankDepositStepType.DEPOSIT_METHODS && (
          <FlyoutChild>
            <PaymentMethods
              {...this.props}
              handleClose={this.handleClose}
              handleBack={this.handleBack}
              handleFailure={this.handleFailure}
            />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.brokerage.getStep(state),
  fiatCurrency: 'USD' as FiatType
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer('BANK_DEPOSIT_MODAL', { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  step: BankDepositStepType
}

export type Props = OwnProps &
  LinkStatePropsType &
  ConnectedProps<typeof connector>

type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(Deposit)
