import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'

import DataError from 'components/DataError'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { Loading, LoadingTextEnum } from '../../../components'
import { ModalPropsType } from '../../../types'
import AddBankStatus from '../AddBankStatus'
import Handler from './Handler'

class Success extends PureComponent<ModalPropsType & LinkStatePropsType> {
  state: State = { show: false }

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

  render(): React.ReactNode {
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        isOpen={this.state.show}
        data-e2e='addBankModal'
      >
        {this.props.step === AddBankStepType.ADD_BANK && (
          <FlyoutChild>
            {this.props.buySellMethod?.id ? (
              <Handler
                handleClose={this.handleClose}
                reason={this.props.reason}
                paymentMethodId={this.props.buySellMethod.id}
              />
            ) : this.props.brokerageMethod?.id ? (
              <Handler
                handleClose={this.handleClose}
                reason={this.props.reason}
                paymentMethodId={this.props.brokerageMethod.id}
              />
            ) : (
              <DataError />
            )}
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.ADD_BANK_STATUS && (
          <FlyoutChild>
            <AddBankStatus handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.LOADING && (
          <FlyoutChild>
            <Loading text={LoadingTextEnum.PROCESSING} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  brokerageMethod: selectors.components.brokerage.getAccount(state),
  buySellMethod: selectors.components.buySell.getBSPaymentMethod(state),
  reason: selectors.components.buySell.getReason(state),
  step: selectors.components.brokerage.getAddBankStep(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer(ModalName.ADD_BANK_PLAID_MODAL, { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = ReturnType<typeof mapStateToProps>

type State = { show: boolean }

export type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>

export default enhance(Success)
