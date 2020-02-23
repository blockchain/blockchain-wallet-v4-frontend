import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RemoteDataType } from 'core/types'
import { UserTiersType } from 'data/types'
import LinkFromExchangeAccount from './template'
import modalEnhancer from 'providers/ModalEnhancer'
import React from 'react'

type OwnPropsType = {
  close: () => void
  linkId: string
}

export type LinkStatePropsType = {
  email: string
  emailVerified: boolean
  linkFromExchangeAccountStatus: any
  userTiers: RemoteDataType<any, UserTiersType>
}

export type LinkDispatchPropsType = {
  actions: typeof actions.modules.profile & {
    resendVerifyEmail: () => void
  }
}

export type Props = OwnPropsType & LinkStatePropsType & LinkDispatchPropsType

class LinkFromExchangeAccountContainer extends React.PureComponent<Props> {
  componentDidMount () {
    const { linkId } = this.props
    this.props.actions.linkFromExchangeAccount(linkId)
  }

  render () {
    return <LinkFromExchangeAccount {...this.props} />
  }
}

const mapStateToProps = state => ({
  email: selectors.core.settings.getEmail(state).getOrElse(false),
  emailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(true),
  linkFromExchangeAccountStatus: selectors.modules.profile.getLinkFromExchangeAccountStatus(
    state
  ),
  userTiers: selectors.modules.profile.getUserTiers(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  actions: bindActionCreators(
    {
      ...actions.modules.profile,
      ...actions.modules.securityCenter
    },
    dispatch
  )
})

export default compose<any>(
  modalEnhancer('LinkFromExchangeAccount'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LinkFromExchangeAccountContainer)
