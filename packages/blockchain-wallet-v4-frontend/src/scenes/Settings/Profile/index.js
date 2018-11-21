import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { actions } from 'data'
import { getData } from './selectors'

import IdentityVerification from './IdentityVerification'
import KYCBanner from 'components/IdentityVerification/KYCBanner'
import DataError from 'components/DataError'

import { BlockchainLoader } from 'blockchain-info-components'

const Wrapper = styled.section`
  width: 100%;
`
const Container = styled.div`
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
`

const Loading = () => (
  <Wrapper>
    <BlockchainLoader />
  </Wrapper>
)

export const Profile = ({ data, verifyIdentity, fetchUser }) =>
  data.cata({
    Success: ({ kycState }) => (
      <Wrapper>
        <KYCBanner />
        <Container>
          <IdentityVerification
            kycState={kycState}
            verifyIdentity={verifyIdentity}
          />
        </Container>
      </Wrapper>
    ),
    NotAsked: () => <Loading />,
    Loading: () => <Loading />,
    Failure: () => <DataError onClick={fetchUser} />
  })

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity()),
  fetchUser: () => dispatch(actions.modules.profile.fetchUser())
})

export default connect(
  getData,
  mapDispatchToProps
)(Profile)
