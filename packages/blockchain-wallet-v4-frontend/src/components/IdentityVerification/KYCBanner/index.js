import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { values } from 'ramda'
import { connect } from 'react-redux'

import { KYC_STATES, USER_ACTIVATION_STATES } from 'data/modules/profile/model'
import { getData } from './selectors'
import { actions } from 'data'
import { LinkContainer } from 'react-router-bootstrap'

import { Button, Text, Icon } from 'blockchain-info-components'

const Wrapper = styled.div`
  min-height: ${props => props.minHeight};
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

const SubNote = styled(Text)`
  margin-top: 30px;
`
export const NEW_USER = 'NEW_USER'

export const KYCBanner = ({
  outsideOfProfile,
  kycState,
  userState,
  verifyIdentity
}) => {
  if (outsideOfProfile && kycState === KYC_STATES.VERIFIED) return null
  const isUserStateNone = () => userState === USER_ACTIVATION_STATES.NONE

  const headers = {
    NEW_USER: (
      <FormattedMessage
        id='components.identityverification.popup.header.notcreated'
        defaultMessage='A better way to Exchange Crypto'
      />
    ),
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
    [KYC_STATES.UNDER_REVIEW]: [
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
    [KYC_STATES.REJECTED]: [
      <FormattedMessage
        id='components.identityverification.popup.header.rejected'
        defaultMessage='Verification Failed {icon}'
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
    NEW_USER: (
      <Fragment>
        <FormattedMessage
          id='components.identityverification.popup.note.notcreated'
          defaultMessage="Introducing Blockchain's new and improved crypto exchange function. To begin using this updated feature, please verify your identity. The process only takes a couple of minutes."
        />
        <SubNote color='white' size='12px' weight={400}>
          <FormattedMessage
            id='components.identityverification.popup.note.personalinfosecure'
            defaultMessage='Your personal information is secure with us.'
          />
        </SubNote>
      </Fragment>
    ),
    [KYC_STATES.NONE]: (
      <FormattedMessage
        id='components.identityverification.popup.note.unverified'
        defaultMessage='Complete your profile and identity verification to start exchanging. Don’t worry, we only need a couple more details.'
      />
    ),
    [KYC_STATES.PENDING]: (
      <FormattedMessage
        id='components.identityverification.popup.note.inreview'
        defaultMessage='We are currently reviewing your application. Hang tight! In just a few minutes you will be all set to exchange cryptocurrency,'
      />
    ),
    [KYC_STATES.UNDER_REVIEW]: (
      <FormattedMessage
        id='components.identityverification.popup.note.underreview'
        defaultMessage='We had some trouble verifying your account with the documents provided. Our Support team will contact you shortly to help you with the verification process.'
      />
    ),
    [KYC_STATES.REJECTED]: (
      <FormattedMessage
        id='components.identityverification.popup.note.rejected'
        defaultMessage='Unfortunately we had some trouble with the documents that you’ve supplied and we can’t verifiy your account at this time.'
      />
    ),
    [KYC_STATES.VERIFIED]: (
      <FormattedMessage
        id='components.identityverification.popup.note.verified'
        defaultMessage='Good news – your account is verified. You can now exchange cryptocurrency at any time.'
      />
    )
  }

  const buttons = {
    NEW_USER: (
      <ActionButton nature='primary' fullwidth onClick={verifyIdentity}>
        <FormattedMessage
          id='components.identityverification.popup.button.begin'
          defaultMessage='Begin Now'
        />
      </ActionButton>
    ),
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
    [KYC_STATES.UNDER_REVIEW]: null,
    [KYC_STATES.REJECTED]: null,
    [KYC_STATES.VERIFIED]: (
      <LinkContainer to={'/exchange'}>
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
    <Wrapper minHeight={isUserStateNone() ? '250px' : '210px'}>
      <Container>
        <Header size='20px' weight={300} color='white'>
          {isUserStateNone() ? headers[NEW_USER] : headers[kycState]}
        </Header>
        <Content size='14px' weight={300} color='white'>
          {isUserStateNone() ? notes[NEW_USER] : notes[kycState]}
        </Content>
        {isUserStateNone() ? buttons[NEW_USER] : buttons[kycState]}
      </Container>
    </Wrapper>
  )
}

KYCBanner.propTypes = {
  kycState: PropTypes.oneOf(values(KYC_STATES)).isRequired,
  userState: PropTypes.oneOf(values(USER_ACTIVATION_STATES)).isRequired,
  outsideOfProfile: PropTypes.bool,
  canTrade: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  verifyIdentity: PropTypes.func.isRequired
}

KYCBanner.defaultProps = {
  outsideOfProfile: false
}

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity())
})

export default connect(
  getData,
  mapDispatchToProps
)(KYCBanner)
