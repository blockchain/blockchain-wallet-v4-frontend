import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import {
  PartnerHeader,
  PartnerSubHeader
} from 'components/IdentityVerification'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import media from 'services/ResponsiveService'

const { CHANGE } = model.components.coinify.REGISTER_STATES
const { EMAIL, TERMS } = model.components.coinify.REGISTER_STEPS

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 15%;
`
const SubHeader = styled(PartnerSubHeader)`
  width: 65%;
  ${media.mobile`
    width: 100%;
  `}
`

const Create = props => {
  const { create } = props

  const determineStep = create === CHANGE ? EMAIL : TERMS

  return (
    <Container>
      <MediaContextConsumer>
        {({ mobile }) => (
          <Fragment>
            <PartnerHeader>
              <FormattedMessage
                id='coinifyexchangedata.create.header.createaccount'
                defaultMessage='Create Account'
              />
            </PartnerHeader>
            <SubHeader>
              <FormattedMessage
                id='coinifyexchangedata.create.subheader.getstartedverify'
                defaultMessage="To get started, create and verify your account in a matter of minutes. We'll need your email, personal info and ID"
              />
            </SubHeader>
            {determineStep === EMAIL && (
              <VerifyEmail create={create} {...props} />
            )}
            {determineStep === TERMS && (
              <AcceptTerms create={create} {...props} />
            )}
          </Fragment>
        )}
      </MediaContextConsumer>
    </Container>
  )
}

Create.propTypes = {
  handleSignup: PropTypes.func.isRequired,
  create: PropTypes.string.isRequired
}

export default Create
