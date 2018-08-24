import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { values } from 'ramda'
import { connect } from 'react-redux'

import { MODAL_NAME as KYC_MODAL } from 'data/components/identityVerification/model'
import { KYC_STATES } from 'data/modules/profile/model'
import { getData } from './selectors'
import { actions } from 'data'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Text, Icon } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: ${props =>
    `linear-gradient(153.43deg, ${props.theme['brand-secondary']} 0%, ${
      props.theme['brand-primary']
    } 100%);`};
`
const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: felx-start;
  width: 500px;
  min-height: 150px;
  padding: 30px;
`

const Header = styled(Text)`
  display: flex;
  align-items: center;
  .warning-icon {
    margin-left: 4px;
  }
`

const Content = styled(Text)`
  margin-top: 20px;
`

const ActionButton = styled(Button)`
  margin-top: 30px;
`

export const KYCBanner = ({
  outsideOfProfile,
  canTrade,
  kycState,
  verifyIdentity
}) => {
  if (outsideOfProfile && kycState === KYC_STATES.VERIFIED) return null

  const headers = {
    [KYC_STATES.NONE]: (
      <FormattedMessage
        id='components.identityverification.popup.header.unverified'
        defaultMessage="You're Almost There"
      />
    ),
    [KYC_STATES.PENDING]: (
      <FormattedMessage
        id='components.identityverification.popup.header.inreview'
        defaultMessage='Account In Review'
      />
    ),
    [KYC_STATES.REJECTED]: [
      <FormattedMessage
        id='components.identityverification.popup.header.underreview'
        defaultMessage='Verification Under Review {icon}'
        values={{
          icon: null
        }}
      />,
      <Icon
        name='alert-filled'
        size='20px'
        className='warning-icon'
        color='white'
      />
    ],
    [KYC_STATES.VERIFIED]: (
      <FormattedMessage
        id='components.identityverification.popup.header.verified'
        defaultMessage='Verification Completed'
      />
    )
  }

  const notes = {
    [KYC_STATES.NONE]: (
      <FormattedMessage
        id='components.identityverification.popup.note.unverified'
        defaultMessage='Complete your profile and identity verification to start buying and selling. Don’t worry, we only need a couple more details.'
      />
    ),
    [KYC_STATES.PENDING]: (
      <FormattedMessage
        id='components.identityverification.popup.note.inreview'
        defaultMessage='We are currently reviewing your application. Hang tight! In just a few minutes you will be all set to buy cryptocurrency,'
      />
    ),
    [KYC_STATES.REJECTED]: (
      <FormattedMessage
        id='components.identityverification.popup.note.underreview'
        defaultMessage='We had some trouble verifying your account with the documents provided. Our Support team will contact you shortly to help you with the verification process.'
      />
    ),
    [KYC_STATES.VERIFIED]: (
      <FormattedMessage
        id='components.identityverification.popup.note.verified'
        defaultMessage='Good news – your account is verified. You can now buy, sell, and exchange cryptocurrency at any time. '
      />
    )
  }

  const buttons = {
    [KYC_STATES.NONE]: (
      <ActionButton nature='primary' fullwidth onClick={verifyIdentity}>
        <FormattedMessage
          id='components.identityverification.popup.button.verify'
          defaultMessage='Verify My Identity'
        />
      </ActionButton>
    ),
    [KYC_STATES.PENDING]: outsideOfProfile && (
      <LinkContainer to='/settings/profile'>
        <ActionButton fullwidth>
          <FormattedMessage
            id='components.identityverification.popup.button.checkstatus'
            defaultMessage='Check Your Application Status'
          />
        </ActionButton>
      </LinkContainer>
    ),
    [KYC_STATES.REJECTED]: null,
    [KYC_STATES.VERIFIED]: (
      <LinkContainer to={canTrade ? '/buy-sell' : '/exchange'}>
        <ActionButton nature='primary'>
          <FormattedMessage
            id='components.identityverification.popup.button.getstarted'
            defaultMessage='Get Started'
          />
        </ActionButton>
      </LinkContainer>
    )
  }
  return (
    <Wrapper>
      <Container>
        <Header size='20px' weight={300} color='white'>
          {headers[kycState]}
        </Header>
        <Content size='14px' weight={300} color='white'>
          {notes[kycState]}
        </Content>
        {buttons[kycState]}
      </Container>
    </Wrapper>
  )
}

KYCBanner.propTypes = {
  kycState: PropTypes.oneOf(values(KYC_STATES)).isRequired,
  outsideOfProfile: PropTypes.bool,
  canTrade: PropTypes.bool.isRequired,
  verifyIdentity: PropTypes.func.isRequired
}

KYCBanner.defaultProps = {
  outsideOfProfile: false
}

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () => dispatch(actions.modals.showModal(KYC_MODAL))
})

export default connect(
  getData,
  mapDispatchToProps
)(KYCBanner)
