import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Dispatch } from 'redux'

import { actions } from 'data'

import Template from './template'

const UpgradeToGold: React.FC<Props> = (props: Props) => {
  return <Template verifyIdentity={props.verifyIdentity} handleClose={props.handleClose} />
}

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  verifyIdentity: () => {
    dispatch(actions.components.identityVerification.resetVerificationStep({}))
    dispatch(
      actions.components.identityVerification.verifyIdentity({
        needMoreInfo: false,
        origin: 'BuySell',
        tier: 2
      })
    )
  }
})

const connector = connect(null, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}

type LinkDispatchPropsType = {
  verifyIdentity: () => void
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(UpgradeToGold)
