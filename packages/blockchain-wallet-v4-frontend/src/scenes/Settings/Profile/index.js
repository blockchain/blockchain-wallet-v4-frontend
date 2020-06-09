import { actions } from 'data'
import { BlockchainLoader } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { SceneWrapper } from 'components/Layout'
import DataError from 'components/DataError'
import IdentityVerification from './IdentityVerification'
import Menu from './Menu'
import React from 'react'

const Loading = () => (
  <SceneWrapper centerContent>
    <BlockchainLoader width='200px' height='200px' />
  </SceneWrapper>
)

export const Profile = ({ data, fetchUser }) =>
  data.cata({
    Success: ({ userData, userTiers }) => (
      <SceneWrapper>
        <Menu />
        <IdentityVerification userData={userData} userTiers={userTiers} />
      </SceneWrapper>
    ),
    NotAsked: () => <Loading />,
    Loading: () => <Loading />,
    Failure: () => <DataError onClick={fetchUser} />
  })

const mapDispatchToProps = dispatch => ({
  fetchUser: () => dispatch(actions.modules.profile.fetchUser())
})

export default connect(getData, mapDispatchToProps)(Profile)
