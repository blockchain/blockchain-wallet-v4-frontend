import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Button, IconButton, Icon } from 'blockchain-info-components'

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
const Info = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`
const IdInfo = Info.extend`margin-bottom: 3px;`
const AlertInfo = Info.extend`margin-top: 10px;`

const TitleStrings = ({idType}) => (
  idType === 'id'
    ? <ColLeftInner>
      <Title>
        <FormattedMessage id='sfoxexchangedata.upload.title' defaultMessage='Upload Documents' />
      </Title>
      <Subtitle>
        <FormattedMessage id='sfoxexchangedata.upload.subtitle' defaultMessage='Photo ID Verification' />
      </Subtitle>
      <Info>
        <FormattedMessage id='sfoxexchangedata.upload.info' defaultMessage='To verify your identity and confirm your country of residence, please upload one of the following government-issued forms of ID:' />
      </Info>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.license' defaultMessage='- State-issued driver’s license' />
      </IdInfo>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.passport' defaultMessage='- Passport' />
      </IdInfo>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.govid' defaultMessage='- State or government-issued identification card' />
      </IdInfo>
      <AlertInfo>
        <Text weight={400}>
          <Icon name='alert' size='18px' color='error' />
          <FormattedMessage id='sfoxexchangedata.upload.selfies' defaultMessage='Selfies are not a valid form of ID Verification' />
        </Text>
      </AlertInfo>
    </ColLeftInner>
    : <ColLeftInner>
      <Title>
        <FormattedMessage id='sfoxexchangedata.upload.title' defaultMessage='Upload Documents' />
      </Title>
      <Subtitle>
        <FormattedMessage id='sfoxexchangedata.upload.subtitle' defaultMessage='Address Verification' />
      </Subtitle>
      <Info>
        <FormattedMessage id='sfoxexchangedata.upload.info' defaultMessage='To verify your identity and confirm your country of residence, please upload one of the following government-issued forms of ID:' />
      </Info>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.license' defaultMessage='- State-issued driver’s license' />
      </IdInfo>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.passport' defaultMessage='- Passport' />
      </IdInfo>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.govid' defaultMessage='- State or government-issued identification card' />
      </IdInfo>
      <AlertInfo>
        <Text weight={400}>
          <Icon name='alert' size='18px' color='error' />
          <FormattedMessage id='sfoxexchangedata.upload.selfies' defaultMessage='Selfies are not a valid form of ID Verification' />
        </Text>
      </AlertInfo>
    </ColLeftInner>
)

export default TitleStrings
