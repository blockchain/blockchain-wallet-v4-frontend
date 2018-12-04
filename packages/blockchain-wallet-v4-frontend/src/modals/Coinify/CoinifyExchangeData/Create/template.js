import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import { FormattedMessage } from 'react-intl'
import {
  PartnerHeader,
  PartnerSubHeader
} from 'components/IdentityVerification'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 15%;
`

const Create = props => {
  const { create } = props

  const determineStep = () => {

    if (create === 'change_email' || create === 'enter_email_code') {
      return 'email'
    }
    return 'terms'
  }

  return (
    <Container>
      <PartnerHeader>
        <FormattedMessage
          id='coinifyexchangedata.create.header.createaccount'
          defaultMessage='Create Account'
        />
      </PartnerHeader>
      <PartnerSubHeader>
        <FormattedMessage
          id='coinifyexchangedata.create.subheader.teamedup'
          defaultMessage="We teamed up with Coinify's exchange platform to offer buy and sell to our customers."
        />
      </PartnerSubHeader>
      {determineStep() === 'email' && (
        <VerifyEmail create={create} {...props} />
      )}
      {determineStep() === 'terms' && (
        <AcceptTerms create={create} {...props} />
      )}
    </Container>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  create: PropTypes.string.isRequired
}

export default Create
