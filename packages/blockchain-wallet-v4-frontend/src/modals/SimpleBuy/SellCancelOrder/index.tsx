// import { actions } from 'data'
// import { bindActionCreators, compose, Dispatch } from 'redux'
// import { connect } from 'react-redux'
// import { SwapOrderType } from 'core/types'
// import React, { PureComponent } from 'react'
// import Template from './template'

// export type OwnProps = {
//   handleClose: () => void
//   order: SwapOrderType
// }
// export type LinkDispatchPropsType = {
//   swapActions: typeof actions.components.swap
// }
// type LinkStatePropsType = {}
// type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
// type State = {}

// class CancelOrder extends PureComponent<Props, State> {
//   state = {}

//   handleSubmit = () => {
//     this.props.swapActions.cancelOrder(this.props.order)
//   }

//   render () {
//     return <Template {...this.props} onSubmit={this.handleSubmit} />
//   }
// }

// const mapStateToProps = (): LinkStatePropsType => ({})

// const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
//   swapActions: bindActionCreators(actions.components.swap, dispatch)
// })

// const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

// export default enhance(CancelOrder)
