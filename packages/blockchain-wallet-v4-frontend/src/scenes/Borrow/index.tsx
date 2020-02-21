import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Container } from 'components/Box'
import { FormattedMessage } from 'react-intl'
import { NabuApiErrorType, RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'
import { SceneWrapper } from 'components/Layout'
import { Text } from 'blockchain-info-components'
import { UserDataType } from 'data/types'
import BorrowHistory from './BorrowHistory'
import BorrowPax from './BorrowPax'
import InitBorrowForm from './InitBorrowForm'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

type LinkStatePropsType = {
  invitationsR: RemoteDataType<string | Error, { [key in string]: boolean }>
  userDataR: RemoteDataType<NabuApiErrorType, UserDataType>
}
type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
  identityVerificationActions: typeof actions.components.identityVerification
  routerActions: typeof actions.router
}

export type Props = LinkDispatchPropsType & LinkStatePropsType
export type State = {
  isDisabled: boolean
}

export const Header = styled.div`
  margin-bottom: 40px;
`
export const MainTitle = styled(Text)`
  margin-bottom: 8px;
`

class Borrow extends PureComponent<Props, State> {
  state: State = { isDisabled: false }

  componentDidMount () {
    if (!this.props.invitationsR.getOrElse({ borrow: false }).borrow) {
      this.props.routerActions.push('/home')
    }

    this.props.borrowActions.fetchBorrowOffers()

    const userData = this.props.userDataR.getOrElse({
      tiers: { current: 0 }
    })
    const tier = userData.tiers.current
    const isDisabled = tier < 2
    /* eslint-disable */
    this.setState({ isDisabled })
    /* eslint-enable */
    if (isDisabled) return
    this.props.borrowActions.fetchUserBorrowHistory()
  }

  render () {
    return (
      <SceneWrapper>
        <Header>
          <MainTitle size='32px' color='grey800' weight={600}>
            <FormattedMessage
              id='scenes.borrow.blockchain'
              defaultMessage='Borrow'
            />
          </MainTitle>
          <Text size='16px' color='grey400' weight={500}>
            <FormattedMessage
              id='scenes.borrow.subheader'
              defaultMessage='Blockchain.com now lets you borrow USD Pax directly from your Blockchain Wallet with crypto as collateral.'
            />
          </Text>
        </Header>
        <Container>
          <BorrowPax {...this.state} {...this.props} />
          <InitBorrowForm {...this.state} />
        </Container>
        <BorrowHistory />
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  invitationsR: selectors.core.settings.getInvitations(state),
  userDataR: selectors.modules.profile.getUserData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Borrow)
