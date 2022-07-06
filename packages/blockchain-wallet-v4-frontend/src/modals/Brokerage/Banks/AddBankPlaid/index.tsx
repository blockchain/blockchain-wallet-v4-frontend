import React, { PureComponent, useState } from 'react'
import { connect, ConnectedProps, useDispatch } from 'react-redux'
import { compose } from 'redux'
import styled from 'styled-components'

import { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import AddBankStatus from '../AddBankStatus'
import Handler from './Handler'

class Success extends PureComponent<ModalPropsType & LinkStatePropsType> {
  render(): React.ReactNode {
    if (this.props.step === AddBankStepType.ADD_BANK_STATUS) {
      return (
        <FlyoutChild>
          <AddBankStatus handleClose={this.props.close} />
        </FlyoutChild>
      )
    }
    if (this.props.step === AddBankStepType.ADD_BANK) {
      return <Handler />
    }
    return <>foo</>
  }
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.brokerage.getAddBankStep(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer(ModalName.ADD_BANK_PLAID_MODAL, { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  step: AddBankStepType
}

export type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>

export default enhance(Success)
