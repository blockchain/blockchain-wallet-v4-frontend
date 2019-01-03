import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import AcceptTerms from './AcceptTerms'
import VerifyEmail from './VerifyEmail'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import {
  FaqFormMessage,
  PartnerHeader,
  PartnerSubHeader
} from 'components/IdentityVerification'
import { MediaContextConsumer } from 'providers/MatchMediaProvider'
import media from 'services/ResponsiveService'

const { CHANGE } = model.components.coinify.REGISTER_STATES
const { EMAIL, TERMS } = model.components.coinify.REGISTER_STEPS

const CoinifyFaqFormMessage = styled(FaqFormMessage)`
  left: 60%;
  top: 10%;
  margin-left: 20px;
`
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
                id='coinifyexchangedata.create.subheader.teamedup'
                defaultMessage="We teamed up with Coinify's exchange platform to offer buy and sell to our customers."
              />
            </SubHeader>
            {determineStep === EMAIL && (
              <VerifyEmail create={create} {...props} />
            )}
            {determineStep === TERMS && (
              <AcceptTerms create={create} {...props} />
            )}
            {
              !mobile && determineStep === TERMS
                ? <CoinifyFaqFormMessage
                  icon='cart'
                  title={
                    <FormattedMessage
                      id='coinifyexchangedata.create.faq.title'
                      defaultMessage="What's Coinify?"
                    />
                  }
                  text={
                    <FormattedMessage
                      id='coinifyexchangedata.create.faq.text'
                      defaultMessage="Coinify is a trading platform we've partnered with to bring you a harmonious buy & sell experience in your Blockchain wallet."
                    />
                  }
                />
                : null
            }
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
