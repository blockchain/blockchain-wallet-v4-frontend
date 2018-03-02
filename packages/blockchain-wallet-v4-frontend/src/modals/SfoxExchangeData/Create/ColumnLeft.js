import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

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
const ColumnLeft = (props) => (

  <ColLeft>
      {
        props.emailVerified && props.mobileVerified
          ? <ColLeftInner>
            <Title>
              <FormattedMessage id='sfoxexchangedata.create.titlecreate' defaultMessage='Create Your SFOX Account' />
            </Title>
            <Subtitle>
              <FormattedMessage id='sfoxexchangedata.create.subtitleaccept' defaultMessage='Accept Terms & Conditions to create your SFOX account.' />
            </Subtitle>
          </ColLeftInner>
          : !props.mobileVerified
            ? <ColLeftInner>
              <Title>
                <FormattedMessage id='sfoxexchangedata.create.titlephone' defaultMessage='Verify Phone Number' />
              </Title>
              <Subtitle>
                <FormattedMessage id='sfoxexchangedata.create.subtitlemobile' defaultMessage='We just sent a verification code to your phone. Please enter the verification code to continue creating your SFOX exchange account.' />
              </Subtitle>
            </ColLeftInner>
            : <ColLeftInner>
              <Title>
                <FormattedMessage id='sfoxexchangedata.create.titleemail' defaultMessage='Verify Email Address' />
              </Title>
              <Subtitle>
                <FormattedMessage id='sfoxexchangedata.create.subtitleemail' defaultMessage='We just sent a verification code to your email address. Please enter the verification code to continue creating your SFOX exchange account.' />
              </Subtitle>
            </ColLeftInner>
      }
  </ColLeft>
)

export default ColumnLeft
