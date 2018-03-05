import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

const ColLeft = styled.div`
  width: 40%;
`
const ColLeftInner = styled.div`
  width: 80%;
`
const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 20px;
`
const Subtitle = styled.div`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 15px;
`

function whichText (data) {
  if (data.emailVerified && data.mobileVerified && !data.changingEmail) {
    return (
      <span>
        <Title>
          <FormattedMessage id='sfoxexchangedata.create.titlecreate' defaultMessage='Create Your SFOX Account' />
        </Title>
        <Subtitle>
          <FormattedMessage id='sfoxexchangedata.create.subtitleaccept' defaultMessage='Accept Terms & Conditions to create your SFOX account.' />
        </Subtitle>
      </span>
    )
  }
  if (!data.mobileVerified && !data.changingEmail) {
    return (
      <span>
        <Title>
          <FormattedMessage id='sfoxexchangedata.create.titlephone' defaultMessage='Verify Phone Number' />
        </Title>
        <Subtitle>
          <FormattedMessage id='sfoxexchangedata.create.subtitlemobile' defaultMessage='We just sent a verification code to your phone. Please enter the verification code to continue creating your SFOX exchange account.' />
        </Subtitle>
      </span>
    )
  }
  if (!data.emailVerified) {
    return (
      <span>
        <Title>
          <FormattedMessage id='sfoxexchangedata.create.titleemail' defaultMessage='Verify Email Address' />
        </Title>
        <Subtitle>
          <FormattedMessage id='sfoxexchangedata.create.subtitleemail' defaultMessage='We just sent a verification code to your email address. Please enter the verification code to continue creating your SFOX exchange account.' />
        </Subtitle>
      </span>
    )
  }
  if (data.changingEmail) {
    return (
      <span>
        <Title>
          <FormattedMessage id='sfoxexchangedata.create.titlechangeemail' defaultMessage='Change Email' />
        </Title>
        <Subtitle>
          <FormattedMessage id='sfoxexchangedata.create.subtitlechangeemail' defaultMessage='Updating your email will also change the email associated with your wallet.' />
        </Subtitle>
      </span>
    )
  }
}

const ColumnLeft = (props) => (
  <ColLeft>
    {whichText(props)}
  </ColLeft>
)

ColumnLeft.propTypes = {
  emailVerified: PropTypes.number.isRequired,
  mobileVerified: PropTypes.bool.isRequired,
  changingEmail: PropTypes.bool
}

export default ColumnLeft
