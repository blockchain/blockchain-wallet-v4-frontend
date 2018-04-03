import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Text, Icon } from 'blockchain-info-components'
import { ColLeftInner, Info, PartnerHeader, PartnerSubHeader } from 'components/BuySell/Signup'
import { spacing } from 'services/StyleService'

const IdInfo = Info.extend`margin-bottom: 3px;`
const LockIcon = styled(Icon)`
  font-size: 24px;
  margin-left: 7px;
`

const TitleStrings = ({idType}) => (
  idType === 'id'
    ? <ColLeftInner>
      <PartnerHeader>
        <FormattedMessage id='sfoxexchangedata.upload.title' defaultMessage='The Hidden Details' />
        <LockIcon name='lock-filled' />
      </PartnerHeader>
      <PartnerSubHeader>
        <FormattedMessage id='sfoxexchangedata.upload.subtitle' defaultMessage='To further confirm your identity and ensure that you can trade at the maximum limit, we need a picture of your government issued ID. Make sure that your legal name and date of birth are clearly visible.' />
      </PartnerSubHeader>
      <Text weight={400} style={spacing('mt-15')}>
        <FormattedMessage id='sfoxexchangedata.upload.info' defaultMessage='1. Photo ID Verification' />
      </Text>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.license' defaultMessage='- State-issued driver’s license' />
      </IdInfo>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.passport' defaultMessage='- Passport' />
      </IdInfo>
      <IdInfo style={spacing('mb-15')}>
        <FormattedMessage id='sfoxexchangedata.upload.govid' defaultMessage='- State or government-issued identification card' />
      </IdInfo>
    </ColLeftInner>
    : <ColLeftInner>
      <PartnerHeader>
        <FormattedMessage id='sfoxexchangedata.upload.address.title' defaultMessage='The Hidden Details' />
        <LockIcon name='lock-filled' />
      </PartnerHeader>
      <PartnerSubHeader>
        <FormattedMessage id='sfoxexchangedata.upload.address.subtitle' defaultMessage='The document must be dated within the last 6 months, and should clearly display your address.' />
      </PartnerSubHeader>
      <Text weight={400} style={spacing('mt-15')}>
        <FormattedMessage id='sfoxexchangedata.upload.info' defaultMessage='2. Proof of Address Verification' />
      </Text>
      <Text weight={300} size='14px' style={spacing('mt-15')}>
        <FormattedMessage id='sfoxexchangedata.upload.address.info' defaultMessage='- Utility bill (mobile phone bills not accepted)' />
      </Text>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.address.license' defaultMessage='- First and signature page of your lease or mortgage' />
      </IdInfo>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.address.passport' defaultMessage='- First page of your bank statement' />
      </IdInfo>
      <IdInfo style={spacing('mb-15')}>
        <FormattedMessage id='sfoxexchangedata.upload.address.govid' defaultMessage='- DMV or voter registration form' />
      </IdInfo>
    </ColLeftInner>
)

export default TitleStrings
