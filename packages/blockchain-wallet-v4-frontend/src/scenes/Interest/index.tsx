import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { Container } from 'components/Box'
import { FormattedMessage } from 'react-intl'
import { Icon, Link, SkeletonRectangle, Text } from 'blockchain-info-components'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText,
  SceneWrapper
} from 'components/Layout'
import { InterestRateType, RemoteDataType } from 'core/types'
import { UserDataType } from 'data/types'
import IntroCard from './IntroCard'
import SummaryCard from './SummaryCard'
import TransactionList from './TransactionList'

import { getData } from './selectors'
import { Remote } from 'core'
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

/*
  TODO List:
  1) fetch txs and show table if txs exist
*/
class Interest extends React.PureComponent<Props, StateType> {
  state = { isGoldTier: true }

  componentDidMount () {
    this.props.interestActions.fetchInterestRate()
  }

  componentDidUpdate (prevProps: Props) {
    if (
      !Remote.Success.is(prevProps.data) &&
      Remote.Success.is(this.props.data)
    ) {
      this.checkUserData()
    }
  }

  checkUserData = () => {
    // i think we might need to create nabu user here
    const data = this.props.data.getOrElse({
      userData: { tiers: { current: 0 } }
    })
    const tier = data.userData.tiers ? data.userData.tiers.current : 0
    const isGoldTier = tier >= 2
    this.setState({ isGoldTier })
  }

  render () {
    const { isGoldTier } = this.state
    const { data } = this.props

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
            <LearnMoreText size='16px'>
              <FormattedMessage
                id='buttons.learn_more'
                defaultMessage='Learn More'
              />
            </LearnMoreText>
          </LearnMoreLink>
        </SceneSubHeaderText>
        {data.cata({
          Success: val => (
            <>
              <Container>
                <IntroCard {...val} {...this.props} isGoldTier={isGoldTier} />
                {isGoldTier && (
                  <SummaryCard
                    {...val}
                    {...this.props}
                    isGoldTier={isGoldTier}
                  />
                )}
              </Container>
              <TransactionList />
            </>
          ),
          Failure: () => null,
          Loading: () => <SkeletonRectangle width='330px' height='275px' />,
          NotAsked: () => <SkeletonRectangle width='330px' height='275px' />
        })}
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  idvActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

export type StateType = {
  isGoldTier: boolean
}
export type SuccessStateType = {
  interestRate: InterestRateType
  userData: UserDataType
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type LinkDispatchPropsType = {
  idvActions: typeof actions.components.identityVerification
  interestActions: typeof actions.components.interest
}

export type Props = ConnectedProps<typeof connector>

export default connector(Interest)
