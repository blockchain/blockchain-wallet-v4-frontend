import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { values } from 'ramda'

import { actions } from 'data'
import { KYC_STATES } from 'data/modules/profile/model'
import { getData } from './selectors'

import IdentityVerification from './IdentityVerification'
import KYCBanner from 'components/IdentityVerification/KYCBanner'

const Wrapper = styled.section`
  width: 100%;
`
const Container = styled.div`
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
`

export const Profile = ({ kycState, verifyIdentity, userFlowSupported }) => {
  if (!userFlowSupported) return null

  return (
    <Wrapper>
      <KYCBanner />
      <Container>
        <IdentityVerification
          kycState={kycState}
          verifyIdentity={verifyIdentity}
        />
      </Container>
    </Wrapper>
  )
}

Profile.propTypes = {
  kycState: PropTypes.oneOf(values(KYC_STATES)).isRequired,
  userFlowSupported: PropTypes.bool.isRequired
}

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity())
})

export default connect(
  getData,
  mapDispatchToProps
)(Profile)
