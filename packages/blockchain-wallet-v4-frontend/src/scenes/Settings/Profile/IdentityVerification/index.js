import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import { values } from 'ramda'
import styled from 'styled-components'

import { KYC_STATES } from 'data/modules/profile/model'

import { Banner, Button } from 'blockchain-info-components'
import {
  SettingComponent,
  SettingContainer,
  SettingDescription,
  SettingHeader,
  SettingSummary
} from 'components/Setting'
import { LinkContainer } from 'react-router-bootstrap'

const SolidBgBanner = styled(Banner)`
  background: ${props => props.theme[props.color]};
  border: none;
  div {
    color: ${props => props.theme.white};
  }
`
const IdentityVerification = ({ kycState, verifyIdentity }) => {
  const banners = {
    [KYC_STATES.NONE]: (
      <SolidBgBanner color='sent'>
        <FormattedMessage
          id='scenes.profile.identityverification.banner.unverified'
          defaultMessage='Unverified'
          altFont
          light
        />
      </SolidBgBanner>
    ),
    [KYC_STATES.PENDING]: (
      <SolidBgBanner color='brand-yellow'>
        <FormattedMessage
          id='scenes.profile.identityverification.banner.inreview'
          defaultMessage='In Review'
          altFont
          light
        />
      </SolidBgBanner>
    ),
    [KYC_STATES.REJECTED]: (
      <SolidBgBanner color='error'>
        <FormattedMessage
          id='scenes.profile.identityverification.banner.rejected'
          defaultMessage='Failed'
          altFont
          light
        />
      </SolidBgBanner>
    ),
    [KYC_STATES.UNDER_REVIEW]: (
      <SolidBgBanner color='error'>
        <FormattedMessage
          id='scenes.profile.identityverification.banner.underreview'
          defaultMessage='Under Review'
          altFont
          light
        />
      </SolidBgBanner>
    ),
    [KYC_STATES.VERIFIED]: (
      <SolidBgBanner color='success'>
        <FormattedMessage
          id='scenes.profile.identityverification.banner.verified'
          defaultMessage='Verified'
          altFont
          light
        />
      </SolidBgBanner>
    )
  }

  const notes = {
    [KYC_STATES.NONE]: (
      <FormattedMessage
        id='scenes.profile.identityverification.note.unverified'
        defaultMessage='Complete our verification process to begin exchanging cryptocurrency – all within your Blockchain wallet.'
        altFont
        light
      />
    ),
    [KYC_STATES.PENDING]: (
      <FormattedMessage
        id='scenes.profile.identityverification.note.inreview'
        defaultMessage={
          'We are currently reviewing your application. Hang tight! In just a few minutes you will be all set to exchange cryptocurrency.\n {note} In some cases it can take up to 2 hours to get verified.'
        }
        values={{
          note: (
            <strong>
              <br />
              <br />
              Note:
            </strong>
          )
        }}
        altFont
        light
      />
    ),
    [KYC_STATES.UNDER_REVIEW]: (
      <FormattedMessage
        id='scenes.profile.identityverification.note.underreview'
        defaultMessage='We had some trouble verifying your account with the documents provided. Our Support team will contact you shortly to help you with the verification process.'
        altFont
        light
      />
    ),
    [KYC_STATES.REJECTED]: (
      <FormattedMessage
        id='scenes.profile.identityverification.note.rejected'
        defaultMessage='Unfortunately we had some trouble with the documents that you’ve supplied and we can’t verifiy your account at this time.'
        altFont
        light
      />
    ),
    [KYC_STATES.VERIFIED]: (
      <FormattedMessage
        id='scenes.profile.identityverification.note.verified'
        defaultMessage='Good news – your account is verified. You can now exchange cryptocurrency at any time. '
        altFont
        light
      />
    )
  }

  const buttons = {
    [KYC_STATES.NONE]: (
      <Button nature='primary' onClick={verifyIdentity}>
        <FormattedMessage
          id='scenes.profile.identityverification.buttons.verify'
          defaultMessage='Verify My Identity'
        />
      </Button>
    ),
    [KYC_STATES.PENDING]: null,
    [KYC_STATES.REJECTED]: null,
    [KYC_STATES.UNDER_REVIEW]: null,
    [KYC_STATES.VERIFIED]: (
      <LinkContainer to={'/exchange'}>
        <Button nature='primary'>
          <FormattedMessage
            id='scenes.profile.identityverification.button.getstarted'
            defaultMessage='Get Started'
          />
        </Button>
      </LinkContainer>
    )
  }

  return (
    <SettingContainer>
      <SettingSummary>
        <SettingHeader>
          <FormattedMessage
            id='scenes.profile.identityverification.title'
            defaultMessage='Identity Verification'
          />
          {banners[kycState]}
        </SettingHeader>
        <SettingDescription>{notes[kycState]}</SettingDescription>
      </SettingSummary>
      <SettingComponent>{buttons[kycState]}</SettingComponent>
    </SettingContainer>
  )
}

IdentityVerification.propTypes = {
  kycState: PropTypes.oneOf(values(KYC_STATES)).isRequired,
  verifyIdentity: PropTypes.func.isRequired
}

export default IdentityVerification
