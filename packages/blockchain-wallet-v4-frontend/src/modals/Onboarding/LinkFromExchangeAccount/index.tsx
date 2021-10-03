import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { ModalName, UserTiersType } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import Failure from './template.failure'
import Loading from './template.loading'
import NotAsked from './template.notasked'
import Success from './template.success'

type OwnPropsType = {
  close: () => void
  linkId: string
} & ModalPropsType

export type LinkStatePropsType = {
  email: string
  emailVerified: boolean
  linkFromExchangeAccountStatus: any
  userTiers: RemoteDataType<any, UserTiersType>
  walletId: string
}

export type LinkDispatchPropsType = {
  actions: typeof actions.modules.profile & {
    resendVerifyEmail: () => void
  }
}

export type Props = OwnPropsType & LinkStatePropsType & LinkDispatchPropsType

type State = { direction: 'left' | 'right'; show: boolean }

class LinkFromExchangeAccountContainer extends React.PureComponent<Props, State> {
  state: State = { direction: 'left', show: true }

  componentDidMount() {
    const { linkId } = this.props
    this.props.actions.linkFromExchangeAccount(linkId)
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render() {
    return this.props.linkFromExchangeAccountStatus.cata({
      Failure: (error) => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='infoModalLinkFromExchangeAccount'
        >
          <FlyoutChild>
            <Failure {...this.props} close={this.handleClose} error={error} />
          </FlyoutChild>
        </Flyout>
      ),
      Loading: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='infoModalLinkFromExchangeAccount'
        >
          <FlyoutChild>
            <Loading {...this.props} close={this.handleClose} />
          </FlyoutChild>
        </Flyout>
      ),
      NotAsked: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='infoModalLinkFromExchangeAccount'
        >
          <FlyoutChild>
            <NotAsked {...this.props} close={this.handleClose} />
          </FlyoutChild>
        </Flyout>
      ),
      Success: (val) => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          isOpen={this.state.show}
          data-e2e='infoModalLinkFromExchangeAccount'
        >
          <FlyoutChild>
            <Success data={val} {...this.props} close={this.handleClose} />
          </FlyoutChild>
        </Flyout>
      )
    })
  }
}

const mapStateToProps = (state) => ({
  email: selectors.core.settings.getEmail(state).getOrElse(false),
  emailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(true),
  linkFromExchangeAccountStatus: selectors.modules.profile.getLinkFromExchangeAccountStatus(state),
  userTiers: selectors.modules.profile.getUserTiers(state),
  walletId: selectors.core.wallet.getGuid(state) as string
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
  modalEnhancer(ModalName.LINK_FROM_EXCHANGE_ACCOUNT_MODAL),
  connect(mapStateToProps, mapDispatchToProps)
)(LinkFromExchangeAccountContainer)
