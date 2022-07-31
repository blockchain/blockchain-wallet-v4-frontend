import React, { PureComponent, useState } from 'react'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType, ModalName, PlaidSettlementErrorReasons } from 'data/types'
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
            <Handler handleClose={this.handleClose} reason={this.props.reason} />
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
  reason: selectors.components.buySell.getReason(state),
  step: selectors.components.brokerage.getAddBankStep(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer(ModalName.ADD_BANK_PLAID_MODAL, { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  reason?: PlaidSettlementErrorReasons
  step: AddBankStepType
}

type State = { show: boolean }

export type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>

export default enhance(Success)
