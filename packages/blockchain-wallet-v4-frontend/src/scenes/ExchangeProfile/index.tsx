import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { BlockchainLoader } from 'blockchain-info-components'
import { connect, ConnectedProps } from 'react-redux'
import { getData } from './selectors'
import { SceneWrapper } from 'components/Layout'
import DataError from 'components/DataError'
import IdentityVerification from './IdentityVerification'
import React from 'react'

const Loading = () => (
  <SceneWrapper centerContent>
    <BlockchainLoader width='80px' height='80px' />
  </SceneWrapper>
)

export const Profile = (props: Props) =>
  props.data.cata({
    Success: () => (
      <SceneWrapper>
        <IdentityVerification {...props} />
      </SceneWrapper>
    ),
    NotAsked: () => <Loading />,
    Loading: () => <Loading />,
    Failure: () => <DataError onClick={props.fetchUser} />
  })

const mapDispatchToProps = dispatch => ({
  fetchUser: () => dispatch(actions.modules.profile.fetchUser()),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(getData, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(Profile)
