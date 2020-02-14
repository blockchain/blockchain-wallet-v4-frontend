import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Container } from 'components/Box'
import { FormattedMessage } from 'react-intl'
import { RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'
import { routerActions } from 'connected-react-router'
import { SceneWrapper } from 'components/Layout'
import { Text } from 'blockchain-info-components'
import BorrowHistory from './BorrowHistory'
import BorrowPax from './BorrowPax'
import InitBorrowForm from './InitBorrowForm'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

type LinkStatePropsType = {
  invitationsR: RemoteDataType<string | Error, { [key in string]: boolean }>
}
type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
  routerActions: typeof actions.router
}

type Props = LinkDispatchPropsType & LinkStatePropsType
interface State {}

export const Header = styled.div`
  margin-bottom: 40px;
`
export const MainTitle = styled(Text)`
  margin-bottom: 8px;
`

class Borrow extends PureComponent<Props, State> {
  state = {}

  componentDidMount () {
    if (!this.props.invitationsR.getOrElse({ borrow: false }).borrow) {
      this.props.routerActions.push('/home')
    }

    this.props.borrowActions.fetchBorrowOffers()
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
          <BorrowPax />
          <InitBorrowForm />
        </Container>
        <BorrowHistory />
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  invitationsR: selectors.core.settings.getInvitations(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Borrow)
