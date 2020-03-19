import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from 'data/rootReducer'
import { SBOrderType } from 'core/types'
import React, { PureComponent } from 'react'
import TransferDetails from './template.transfer'

export type OwnProps = {
  handleClose: () => void
  order: SBOrderType
}
type SuccessStateType = {}
type LinkDispatchPropsType = {}
type LinkStatePropsType = {}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class OrderDetails extends PureComponent<Props, State> {
  state = {}

  render () {
    switch (this.props.order.state) {
      case 'PENDING_CONFIRMATION':
      case 'PENDING_DEPOSIT':
        return <TransferDetails {...this.props} />
    }
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetails)
