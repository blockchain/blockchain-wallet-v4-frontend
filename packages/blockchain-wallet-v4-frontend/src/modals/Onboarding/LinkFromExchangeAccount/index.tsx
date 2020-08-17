import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { ModalPropsType } from '../../types'
import { RemoteDataType } from 'core/types'
import { UserTiersType } from 'data/types'
import Failure from './template.failure'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import Loading from './template.loading'
import modalEnhancer from 'providers/ModalEnhancer'
import NotAsked from './template.notasked'
import React from 'react'
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
}

export type LinkDispatchPropsType = {
  actions: typeof actions.modules.profile & {
    resendVerifyEmail: () => void
  }
}

export type Props = OwnPropsType & LinkStatePropsType & LinkDispatchPropsType

type State = { direction: 'left' | 'right'; show: boolean }

class LinkFromExchangeAccountContainer extends React.PureComponent<
  Props,
  State
> {
  state: State = { show: true, direction: 'left' }
  componentDidMount () {
    const { linkId } = this.props
    this.props.actions.linkFromExchangeAccount(linkId)
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render () {
    return this.props.linkFromExchangeAccountStatus.cata({
      Success: val => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='infoModalLinkFromExchangeAccount'
        >
          <FlyoutChild>
            <Success {...val} {...this.props} close={this.handleClose} />
          </FlyoutChild>
        </Flyout>
      ),

      Failure: error => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='infoModalLinkFromExchangeAccount'
        >
          <FlyoutChild>
            <Failure {...this.props} close={this.handleClose} {...error} />
          </FlyoutChild>
        </Flyout>
      ),
      Loading: () => (
        <Flyout
          {...this.props}
          onClose={this.handleClose}
          in={this.state.show}
          direction={this.state.direction}
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
          in={this.state.show}
          direction={this.state.direction}
          data-e2e='infoModalLinkFromExchangeAccount'
        >
          <FlyoutChild>
            <NotAsked {...this.props} close={this.handleClose} />
          </FlyoutChild>
        </Flyout>
      )
    })
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
  connect(mapStateToProps, mapDispatchToProps)
)(LinkFromExchangeAccountContainer)
