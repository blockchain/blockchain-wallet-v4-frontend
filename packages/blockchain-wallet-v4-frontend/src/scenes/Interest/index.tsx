import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import {
  CoinType,
  InterestAccountBalanceType,
  InterestRateType,
  NabuApiErrorType,
  RemoteDataType
} from 'core/types'
import { connect, ConnectedProps } from 'react-redux'
import { Container } from 'components/Box'
import { FormattedMessage } from 'react-intl'
import { Icon, Link, Text } from 'blockchain-info-components'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText,
  SceneWrapper
} from 'components/Layout'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'
import EarnInterestInfo from './InterestInfo'
import InterestHistory from './InterestHistory'
import InterestSummary from './InterestDepositBox'

import React from 'react'
import styled from 'styled-components'

const LearnMoreLink = styled(Link)`
  display: inline-flex;
`
const LearnMoreText = styled(Text)`
  margin-left: 3px;
  size: 16px;
  font-weight: 500;
  color: ${props => props.theme.blue600};
`

type StateType = {
  isDisabled: boolean
}
class Interest extends React.PureComponent<Props, StateType> {
  state = {
    isDisabled: false
  }
  componentDidMount () {
    this.checkUserData()
    this.props.interestActions.fetchInterestEligible()
    this.props.interestActions.fetchInterestLimits()
  }

  componentDidUpdate (prevProps: Props) {
    if (
      this.props.userDataR.getOrElse(null) !==
      prevProps.userDataR.getOrElse(null)
    ) {
      this.checkUserData()
    }
  }

  checkUserData = () => {
    const userData = this.props.userDataR.getOrElse({
      tiers: { current: 0 }
    })
    const tier = userData.tiers ? userData.tiers.current : 0
    const isDisabled = tier < 2

    this.setState({ isDisabled })

    // fetch users transactions history here this.props.interestActions.fetchInterestTransactions
  }

  render () {
    return (
      <SceneWrapper>
        <SceneHeader>
          <IconBackground>
            <Icon color='blue600' name='savings-icon' size='24px' />
          </IconBackground>
          <SceneHeaderText>
            <FormattedMessage
              id='scenes.interest.interestaccount'
              defaultMessage='Interest Account'
            />
          </SceneHeaderText>
        </SceneHeader>
        <SceneSubHeaderText>
          <FormattedMessage
            id='scenes.interest.subheader'
            defaultMessage='Deposit crypto and watch it grow without fees.'
          />
          <LearnMoreLink
            href='https://support.blockchain.com/hc/en-us/sections/360008572552'
            target='_blank'
          >
            <LearnMoreText size='15px'>
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
          </LearnMoreLink>
        </SceneSubHeaderText>
        <Container>
          <EarnInterestInfo {...this.state} {...this.props} />
          <InterestSummary {...this.state} {...this.props} />
        </Container>
        <InterestHistory />
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  userDataR: selectors.modules.profile.getUserData(state),
  interestRateR: selectors.components.interest.getInterestRate(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type OwnProps = {
  coin: CoinType
  interestAccountBalance: InterestAccountBalanceType
  interestRate: InterestRateType
  isDisabled: boolean
}

type LinkStatePropsType = {
  interestRateR: RemoteDataType<string, InterestRateType>
  userDataR: RemoteDataType<NabuApiErrorType, UserDataType>
}
export type LinkDispatchPropsType = {
  identityVerificationActions: typeof actions.components.identityVerification
  interestActions: typeof actions.components.interest
  modalActions: typeof actions.modals
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(Interest)
