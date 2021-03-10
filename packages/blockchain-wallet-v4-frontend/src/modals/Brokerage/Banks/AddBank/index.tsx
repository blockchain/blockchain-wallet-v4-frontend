import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import Add from './Add'
import Handler from './Handler'
import Status from './Status'

class Banks extends PureComponent<Props> {
  state: State = { show: false, direction: 'left' }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (AddBankStepType[this.props.step] > AddBankStepType[prevProps.step]) {
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

  render() {
    return (
      <Flyout
        {...this.props}
        onClose={this.handleClose}
        in={this.state.show}
        direction={this.state.direction}
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
            <Status {...this.props} handleClose={this.handleClose} />
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
  ModalEnhancer('ADD_BANK_MODAL', { transition: duration }),
  connector
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  step: AddBankStepType
}

export type Props = OwnProps &
  LinkStatePropsType &
  ConnectedProps<typeof connector>

type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(Banks)
