import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { Icon } from 'blockchain-info-components'
import {
  NabuApiErrorType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'
import { Container } from 'components/Box'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText,
  SceneWrapper
} from 'components/Layout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

import BorrowHistory from './BorrowHistory'
import BorrowPax from './BorrowPax'
import InitBorrowForm from './InitBorrowForm'

class Borrow extends PureComponent<Props, State> {
  state: State = { isDisabled: true }

  componentDidMount() {
    this.props.borrowActions.fetchBorrowOffers()
    this.checkUserData()
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.userDataR.getOrElse({} as UserDataType) !==
      prevProps.userDataR.getOrElse({} as UserDataType)
    ) {
      this.checkUserData()
    }
  }

  checkUserData = () => {
    const userData = this.props.userDataR.getOrElse({
      tiers: { current: 0 }
    } as UserDataType)
    const tier = userData.tiers ? userData.tiers.current : 0
    const isDisabled = tier < 2
    /* eslint-disable */
    this.setState({ isDisabled })
    /* eslint-enable */
    if (isDisabled) return
    this.props.borrowActions.fetchUserBorrowHistory()
  }

  render() {
    return (
      <SceneWrapper>
        <SceneHeader>
          <IconBackground>
            <Icon name='borrow' color='blue600' size='24px' />
          </IconBackground>
          <SceneHeaderText>
            <FormattedMessage
              id='scenes.borrow.blockchain'
              defaultMessage='Borrow'
            />
          </SceneHeaderText>
        </SceneHeader>
        <SceneSubHeaderText>
          <FormattedMessage
            id='scenes.borrow.subheader'
            defaultMessage='Blockchain.com lets you borrow USD Digital from your Blockchain Wallet with crypto as collateral.'
          />
        </SceneSubHeaderText>
        <Container>
          <BorrowPax {...this.state} {...this.props} />
          <InitBorrowForm {...this.state} {...this.props} />
        </Container>
        <BorrowHistory />
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  userDataR: selectors.modules.profile.getUserData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)
type LinkStatePropsType = {
  userDataR: RemoteDataType<NabuApiErrorType, UserDataType>
}
export type Props = ConnectedProps<typeof connector>
export type State = {
  isDisabled: boolean
}

export default connector(Borrow)
