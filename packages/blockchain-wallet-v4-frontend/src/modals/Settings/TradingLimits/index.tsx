import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import ModalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from './../../types'
import { getData } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

export type OwnProps = {
  handleClose: () => void
} & ModalPropsType

class TradingLimits extends PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
    this.props.fetchUser()
    this.props.fetchProductsEligibility()
    this.props.fetchInterestEDDStatus()
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    return this.props.data.cata({
      Success: val => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='tradingLimitsModal'
        >
          <FlyoutChild>
            <Success {...val} {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        </Flyout>
      ),
      NotAsked: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='tradingLimitsModal'
        >
          <FlyoutChild>
            <Loading />
          </FlyoutChild>
        </Flyout>
      ),
      Loading: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='tradingLimitsModal'
        >
          <FlyoutChild>
            <Loading />
          </FlyoutChild>
        </Flyout>
      ),
      Failure: () => null
    })
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUser: () => dispatch(actions.modules.profile.fetchUser()),
  fetchInterestEDDStatus: () =>
    dispatch(actions.components.interest.fetchEDDStatus()),
  fetchProductsEligibility: () =>
    dispatch(actions.components.settings.fetchProductsEligibility()),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer('TRADING_LIMITS', { transition: duration }),
  connector
)

export type SuccessStateType = ReturnType<typeof getData>['data']

export type Props = OwnProps & ConnectedProps<typeof connector>
type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(TradingLimits)
