import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { ModalPropsType } from 'blockchain-wallet-v4-frontend/src/modals/types'
import { compose } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { AddBankStepType } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { Loading, LoadingTextEnum } from '../../../components'
import AddBankStatus from '../AddBankStatus'
import Authorize from './Authorize'
import Connect from './Connect'
import SelectBank from './SelectBank'

class Banks extends PureComponent<Props> {
  state: State = { show: false, yapilyBankId: '' }

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

  setYapilyBankId = (yapilyBankId: string) => {
    this.setState({ yapilyBankId })
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
            <SelectBank
              setYapilyBankId={this.setYapilyBankId}
              handleClose={this.handleClose}
            />
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.ADD_BANK_CONNECT && (
          <FlyoutChild>
            <Connect
              handleClose={this.handleClose}
              yapilyBankId={this.state.yapilyBankId}
            />
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.ADD_BANK_AUTHORIZE && (
          <FlyoutChild>
            <Authorize handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.ADD_BANK_STATUS && (
          <FlyoutChild>
            <AddBankStatus
              handleClose={this.handleClose}
              yapilyBankId={this.state.yapilyBankId}
            />
          </FlyoutChild>
        )}
        {this.props.step === AddBankStepType.LOADING && (
          <FlyoutChild>
            <Loading text={LoadingTextEnum.LOADING} />
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
  show: boolean
  yapilyBankId: string
}

export default enhance(Banks)
