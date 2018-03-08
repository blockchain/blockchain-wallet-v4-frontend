import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

const ColLeft = styled.div`
  width: 40%;
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

function header (data) {
  switch (true) {
    case data.changingEmail: return <FormattedMessage id='sfoxexchangedata.create.titlechangeemail' defaultMessage='Change Email' />
    case !data.emailVerified: return <FormattedMessage id='sfoxexchangedata.create.titleemail' defaultMessage='Verify Email Address' />
    case !data.mobileVerified: return <FormattedMessage id='sfoxexchangedata.create.titlephone' defaultMessage='Verify Phone Number' />
    default: return <FormattedMessage id='sfoxexchangedata.create.titlecreate' defaultMessage='Create Your SFOX Account' />
  }
}

function copy (data) {
  switch (true) {
    case data.changingEmail: return <FormattedMessage id='sfoxexchangedata.create.subtitlechangeemail' defaultMessage='Updating your email will also change the email associated with your wallet.' />
    case !data.emailVerified: return <FormattedMessage id='sfoxexchangedata.create.subtitleemail' defaultMessage='We just sent a verification code to your email address. Please enter the verification code to continue creating your SFOX exchange account.' />
    case !data.mobileVerified: return <FormattedMessage id='sfoxexchangedata.create.subtitlemobile' defaultMessage='We just sent a verification code to your phone. Please enter the verification code to continue creating your SFOX exchange account.' />
    default: return <FormattedMessage id='sfoxexchangedata.create.subtitleaccept' defaultMessage='Accept Terms & Conditions to create your SFOX account.' />
  }
}

const ColumnLeft = (props) => (
  <ColLeft>
    <Title>{header(props)}</Title>
    <Subtitle>{copy(props)}</Subtitle>
  </ColLeft>
)

ColumnLeft.propTypes = {
  emailVerified: PropTypes.bool.isRequired,
  mobileVerified: PropTypes.bool.isRequired,
  changingEmail: PropTypes.bool
}

export default ColumnLeft
