import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { SBOrderType } from 'blockchain-wallet-v4/src/types'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { actions } from 'data'
import Template from './template'

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
export type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class CancelOrder extends PureComponent<Props, State> {
  state = {}

  handleSubmit = () => {
    this.props.simpleBuyActions.cancelSBOrder(this.props.order)
  }

  render () {
    return <Template {...this.props} onSubmit={this.handleSubmit} />
  }
}

const mapStateToProps = (): LinkStatePropsType => ({})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export default enhance(CancelOrder)
