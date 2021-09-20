import React, { PureComponent } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { actions } from 'data'

import Template from './template'

export type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
  verifyIdentity: () => void
}

class UpgradeToGold extends PureComponent<Props> {
  render() {
    return <Template {...this.props} />
  }
}

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  verifyIdentity: () => {
    dispatch(actions.components.identityVerification.resetVerificationStep())
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'SimpleBuy',
        tier: 2
      })
    )
  }
})

const connector = connect(null, mapDispatchToProps)

export type OwnProps = {
  handleClose: () => void
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(UpgradeToGold)
