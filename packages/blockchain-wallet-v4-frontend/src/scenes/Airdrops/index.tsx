import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { lift } from 'ramda'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'
import {
  NabuApiErrorType,
  RemoteDataType
} from 'blockchain-wallet-v4/src/types'
import {
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText
} from 'components/Layout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserCampaignsType, UserDataType } from 'data/types'

import EmailRequired from './components'
import PastAirdropsSuccess from './PastAirdrops/template.success'
import Loading from './template.loading'
import Success from './template.success'

const Wrapper = styled.div`
  width: 100%;
`
export const Header = styled.div`
  margin-bottom: 40px;
`
export const History = styled.div`
  margin-top: 120px;
`
export const MainTitle = styled(Text)`
  margin-bottom: 8px;
`

class Airdrops extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.profileActions.fetchUserCampaigns()
  }

  render() {
    const { data, hasEmail } = this.props
    const userData = this.props.data.getOrElse({
      kycState: 'NONE'
    } as SuccessStateType)
    const AirdropCards = data.cata({
      Success: val => <Success {...val} {...this.props} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Failure: e =>
        e.type === 'INVALID_CREDENTIALS' ? (
          // @ts-ignore
          <Success
            {...this.props}
            userDoesNotExistYet
            userCampaignsInfoResponseList={[]}
            kycState='NONE'
            tags={{}}
          />
        ) : (
          <Text size='16px' weight={500}>
            Oops. Something went wrong and we don't know why.{' '}
            <b>Here's the error: {e.type}</b>
          </Text>
        )
    })
    const PastAirdrops = data.cata({
      Success: val => <PastAirdropsSuccess {...val} {...this.props} />,
      Loading: () => <Text weight={500}>Loading...</Text>,
      NotAsked: () => <Text weight={500}>Loading...</Text>,
      Failure: e =>
        e.type === 'INVALID_CREDENTIALS' ? (
          <Text weight={500} size='12px'>
            <FormattedMessage
              id='scenes.airdrops.upgradetoview'
              defaultMessage='Please upgrade to view past airdrops.'
            />
          </Text>
        ) : (
          <Text size='16px' weight={500}>
            Oops. Something went wrong and we don't know why.{' '}
            <b>Here's the error: {e.type}</b>
          </Text>
        )
    })
    if (!hasEmail) return <EmailRequired />
    return (
      <Wrapper>
        <SceneHeader>
          <IconBackground>
            <Icon name='parachute' color='blue600' size='24px' />
          </IconBackground>
          <SceneHeaderText>
            <FormattedMessage
              id='scenes.airdrops.header'
              defaultMessage='Airdrops'
            />
          </SceneHeaderText>
        </SceneHeader>
        <SceneSubHeaderText>
          <FormattedMessage
            id='scenes.airdrops.blockchain.safest'
            defaultMessage='The safest and easiest way to try and discover new crypto.'
          />
        </SceneSubHeaderText>
        {AirdropCards}
        {userData.kycState === 'VERIFIED' && (
          <React.Fragment>
            <History>
              <MainTitle size='24px' color='grey800' weight={600}>
                <FormattedMessage
                  id='scenes.airdrops.pastairdrops'
                  defaultMessage='Past Airdrops'
                />
              </MainTitle>
            </History>
            {PastAirdrops}
          </React.Fragment>
        )}
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: lift((userData, campaignData) => ({
    ...userData,
    ...campaignData
  }))(
    selectors.modules.profile.getUserData(state),
    selectors.modules.profile.getUserCampaigns(state)
  ),
  hasEmail: selectors.core.settings
    .getEmail(state)
    .map(Boolean)
    .getOrElse(false)
})

const mapDispatchToProps = dispatch => ({
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  ),
  profileActions: bindActionCreators(actions.modules.profile, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type SuccessStateType = UserDataType & UserCampaignsType
type LinkStatePropsType = {
  data: RemoteDataType<NabuApiErrorType, SuccessStateType>
  hasEmail: boolean
}
export type Props = ConnectedProps<typeof connector>

export default connector(Airdrops)
