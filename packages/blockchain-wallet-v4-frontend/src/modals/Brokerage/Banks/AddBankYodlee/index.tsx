import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType, ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import AddBankStatus from '../AddBankStatus'
import Add from './Add'
import Handler from './Handler'

class Banks extends PureComponent<Props> {
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

  render() {
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        isOpen={this.state.show}
        data-e2e='addBankModal'
      >
        {this.props.step === AddBankStepType.ADD_BANK && (
          <FlyoutChild>
            <Add {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.ADD_BANK_HANDLER && (
          <FlyoutChild>
            <Handler {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.ADD_BANK_STATUS && (
          <FlyoutChild>
            <AddBankStatus {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.brokerage.getAddBankStep(state)
})

const connector = connect(mapStateToProps)

const enhance = compose(
  ModalEnhancer(ModalName.ADD_BANK_YODLEE_MODAL, { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  step: AddBankStepType
}

export type Props = OwnProps & LinkStatePropsType & ConnectedProps<typeof connector>

type State = { show: boolean }

export default enhance(Banks)
