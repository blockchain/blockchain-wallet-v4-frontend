import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
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
import {
  InterestEligibleType,
  InterestRateType,
  NabuApiErrorType,
  RemoteDataType
} from 'core/types'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'
import EarnInterestInfo from './InterestInfo'
import InterestHistory from './InterestHistory'
import InterestSummary from './InterestSummary'

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
type OwnProps = {
  isDisabled: boolean
}

type LinkStatePropsType = {
  interestEligibleR: RemoteDataType<string, InterestEligibleType>
  interestRateR: RemoteDataType<string, InterestRateType>
  userDataR: RemoteDataType<NabuApiErrorType, UserDataType>
}
type LinkDispatchPropsType = {
  identityVerificationActions: typeof actions.components.identityVerification
  interestActions: typeof actions.components.interest
  modalActions: typeof actions.modals
}

export type Props = LinkDispatchPropsType & LinkStatePropsType & OwnProps
export type State = {
  isDisabled: boolean
}
class Interest extends React.PureComponent<Props, State> {
  state: State = { isDisabled: false }
  componentDidMount() {
    this.props.interestActions.fetchInterestEligible()
    this.props.interestActions.fetchInterestRate()
    this.props.interestActions.fetchInterestPaymentAccount('BTC')
    this.props.interestActions.fetchInterestBalance()
    this.checkUserData()
  }

  componentDidUpdate(prevProps: Props) {
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
    /* eslint-disable */
    this.setState({ isDisabled })
    /* eslint-enable */
  }

  getInterestRate = () => {
    this.props.interestActions.fetchInterestRate()
    const interestRate = this.props.interestRateR
  }

  getInterestEligible = () => this.props

  render() {
    return (
      <SceneWrapper>
        <SceneHeader>
          <IconBackground>
            <Icon name="savings-icon" color="blue600" size="24px" />
          </IconBackground>
          <SceneHeaderText>
            <FormattedMessage
              id="scenes.interest.interestaccount"
              defaultMessage="Interest Account"
            />
          </SceneHeaderText>
        </SceneHeader>
        <SceneSubHeaderText>
          <FormattedMessage
            id="scenes.interest.subheader"
            defaultMessage="Deposit crypto and watch it grow without fees."
          />
          <LearnMoreLink
            href="https://www.support.blockchain.com/"
            target="_blank"
          >
            <LearnMoreText size="15px">
              <FormattedMessage
                id="buttons.learn_more"
                defaultMessage="Learn More"
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
  interestRateR: selectors.components.interest.getInterestRate(state),
  interestEligibleR: selectors.components.interest.getInterestEligible(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Interest)
