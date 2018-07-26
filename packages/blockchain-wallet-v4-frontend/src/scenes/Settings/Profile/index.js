import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { values } from 'ramda'

import { actions } from 'data'
import { KYC_STATES } from 'data/modules/profile/model'
import { MODAL_NAME as KYC_MODAL } from 'data/components/identityVerification/model'
import { getData } from './selectors'

import IdentityVerification from './IdentityVerification'

const Wrapper = styled.section`
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
`

export const Profile = ({ kycState, modalActions }) => {
  return (
    <Wrapper>
      <IdentityVerification
        kycState={kycState}
        verifyIdentity={modalActions.showModal.bind(null, KYC_MODAL)}
        contactSupport={() => {}}
        getStarted={() => {}}
      />
    </Wrapper>
  )
}

Profile.propTypes = {
  kycState: PropTypes.oneOf(values(KYC_STATES)).isRequired
}

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(Profile)
