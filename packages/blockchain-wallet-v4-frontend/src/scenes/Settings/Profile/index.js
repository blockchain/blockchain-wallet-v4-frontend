import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

import { actions } from 'data'
import { BlockchainLoader, Text } from 'blockchain-info-components'
import { media } from 'services/styles'
import DataError from 'components/DataError'

import { getData } from './selectors'
import IdentityVerification from './IdentityVerification'
import Menu from './Menu'

const Wrapper = styled.section`
  width: 100%;
  box-sizing: border-box;

  ${media.mobile`
    padding: 0;
  `}
`
const MenuHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`
const Title = styled(Text)`
  margin: 4px 0;
`

const Loading = () => (
  <Wrapper centerContent>
    <BlockchainLoader width='80px' height='80px' />
  </Wrapper>
)

export const Profile = ({ data, fetchUser }) =>
  data.cata({
    Success: ({ userData, userTiers }) => (
      <Wrapper>
        <MenuHeader>
          <Title size='26px' weight={600} color='black'>
            <FormattedMessage
              id='scenes.settings.profile.title'
              defaultMessage='User Profile'
            />
          </Title>
          <Text size='14px' weight={500} color='grey700'>
            <FormattedMessage
              id='scenes.settings.profile.subtitle'
              defaultMessage='View and manage your KYC status and trading limits.'
            />
          </Text>
        </MenuHeader>
        <Menu />
        <IdentityVerification userData={userData} userTiers={userTiers} />
      </Wrapper>
    ),
    NotAsked: () => <Loading />,
    Loading: () => <Loading />,
    Failure: () => <DataError onClick={fetchUser} />
  })

const mapDispatchToProps = dispatch => ({
  fetchUser: () => dispatch(actions.modules.profile.fetchUser())
})

export default connect(getData, mapDispatchToProps)(Profile)
