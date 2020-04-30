import { actions } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'

import {
  CoinType,
  InterestLimitsType,
  RemoteDataType,
  SupportedCoinsType
} from 'core/types'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { ModalPropsType } from '../../types'
import { RatesType } from 'data/types'
import DataError from 'components/DataError'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import Loading from './template.loading'
import modalEnhancer from 'providers/ModalEnhancer'
import React, { PureComponent } from 'react'
import Success from './template.success'

export type OwnProps = ModalPropsType

type State = { direction: 'left' | 'right'; show: boolean }

export type LinkDispatchPropsType = {
  interestActions: typeof actions.components.interest
}

export type SuccessStateType = {
  coin: CoinType
  interestLimits: InterestLimitsType
  rates: RatesType
  supportedCoins: SupportedCoinsType
}

type LinkStatePropsType = {
  data: RemoteDataType<string | Error, SuccessStateType>
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class Interest extends PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    this.props.interestActions.initializeInterest('BTC')
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ show: true })
  }

  handleRefresh = () => {
    this.props.interestActions.initializeInterest('BTC')
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  render () {
    const { data, position, total } = this.props
    const content = data.cata({
      Success: val => (
        <Success {...val} {...this.props} handleClose={this.handleClose} />
      ),
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
    return (
      <Flyout
        position={position}
        in={this.state.show}
        direction={this.state.direction}
        userClickedOutside={this.props.userClickedOutside}
        onClose={this.handleClose}
        data-e2e='interestModal'
        total={total}
      >
        <FlyoutChild>{content}</FlyoutChild>
      </Flyout>
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const enhance = compose(
  modalEnhancer('INTEREST_MODAL', { transition: duration }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(Interest)
