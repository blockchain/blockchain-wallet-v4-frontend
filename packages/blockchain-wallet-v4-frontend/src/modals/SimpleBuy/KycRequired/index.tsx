import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'

import Template from './template'

export type LinkDispatchPropsType = {
  buySellActions: typeof actions.components.buySell
  identityVerificationActions: typeof actions.components.identityVerification
}

class KycRequired extends PureComponent<Props> {
  render() {
    return <Template {...this.props} />
  }
}

const mapStateToProps = (state: RootState) => ({
  order: selectors.components.simpleBuy.getSBOrder(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  identityVerificationActions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(KycRequired)
