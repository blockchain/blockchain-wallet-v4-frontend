import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions } from 'data'
import { RootState } from 'data/rootReducer'

import { getData } from './selectors'
import Success from './template.success'

// This is a new order summary created for sell p3. Order type looks like what is currently a swap order type rather than an SB order type
// Created this separate template so that we don't have to force types to match. Should be resued when Buy uses swap2.0 apis, and OrderSummary folder
// can be deleted

class SellOrderSummary extends PureComponent<Props> {
  componentDidMount() {
    this.props.simpleBuyActions.fetchSBOrders()
  }

  handleRefresh = () => {
    this.props.simpleBuyActions.fetchSBCards()
  }

  render() {
    return <Success {...this.props} {...this.props.data} />
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  sendActions: bindActionCreators(actions.components.send, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})
const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type SuccessStateType = ReturnType<typeof getData>

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(SellOrderSummary)
