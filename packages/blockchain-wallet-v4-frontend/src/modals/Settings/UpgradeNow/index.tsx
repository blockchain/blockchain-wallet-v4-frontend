import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { Text } from 'blockchain-info-components'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import Loading from '../TradingLimits/template.loading'
import getData from './selectors'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
} & ModalPropsType

class UpgradeNow extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { show: false }
  }

  componentDidMount() {
    this.setState({ show: true })
    this.props.fetchEarnEDDStatus()
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
        data-e2e='tradingLimitsModal'
      >
        <FlyoutChild>
          <Success {...this.props.data} {...this.props} handleClose={this.handleClose} />
        </FlyoutChild>
      </Flyout>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchEarnEDDStatus: () => dispatch(actions.components.interest.fetchEDDStatus()),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer(ModalName.UPGRADE_NOW_MODAL, { fixed: true, transition: duration }),
  connector
)

export type SuccessStateType = ReturnType<typeof getData>

export type Props = OwnProps & ConnectedProps<typeof connector>
type State = { show: boolean }

export default enhance(UpgradeNow)
