import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions } from 'data'

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

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  identityVerificationActions: bindActionCreators(actions.components.identityVerification, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(KycRequired)
