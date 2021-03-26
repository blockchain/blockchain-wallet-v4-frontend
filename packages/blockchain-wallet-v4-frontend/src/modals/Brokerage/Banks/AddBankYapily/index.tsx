import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { compose } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../../types'
import AddBankStatus from '../AddBankStatus'
import Authorize from './Authorize'
import Connect from './Connect'
import SelectBank from './SelectBank'

class Banks extends PureComponent<Props> {
  state: State = { show: false, direction: 'left', yapilyBankId: '' }

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

  setYapilyBankId = (yapilyBankId: string) => {
    this.setState({ yapilyBankId })
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
            <SelectBank
              handleClose={this.handleClose}
              setYapilyBankId={this.setYapilyBankId}
            />
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.ADD_BANK_CONNECT && (
          <FlyoutChild>
            <Connect yapilyBankId={this.state.yapilyBankId} />
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.ADD_BANK_AUTHORIZE && (
          <FlyoutChild>
            <Authorize handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.ADD_BANK_STATUS && (
          <FlyoutChild>
            <AddBankStatus handleClose={this.handleClose} />
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
  ModalEnhancer('ADD_BANK_YAPILY_MODAL', { transition: duration }),
  connector
)

type OwnProps = ModalPropsType & {
  handleClose: () => void
}
type LinkStatePropsType = {
  step: AddBankStepType
}

export type Props = OwnProps &
  LinkStatePropsType &
  ConnectedProps<typeof connector>

type State = {
  direction: 'left' | 'right'
  show: boolean
  yapilyBankId: string
}

export default enhance(Banks)
