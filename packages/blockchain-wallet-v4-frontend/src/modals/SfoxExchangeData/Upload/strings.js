import React, { Fragment } from 'react'
import { FormattedMessage } from 'react-intl'
import { Text, Banner } from 'blockchain-info-components'
import { Info, PartnerSubHeader } from 'components/BuySell/Signup'
import { spacing } from 'services/StyleService'

const IdInfo = Info.extend`margin-bottom: 3px;`

const TitleStrings = (props) => (
  props.idType === 'id'
    ? <Fragment>
      <PartnerSubHeader>
        <FormattedMessage id='sfoxexchangedata.upload.subtitle' defaultMessage='To further confirm your identity and ensure that you can trade at the maximum limit, we need a picture of your government issued ID. Make sure that your legal name and date of birth are clearly visible.' />
      </PartnerSubHeader>
      <Text weight={400} style={spacing('mt-15')}>
        <FormattedMessage id='sfoxexchangedata.upload.id.info' defaultMessage='1. Photo ID Verification' />
      </Text>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.license' defaultMessage='- State-issued driver’s license' />
      </IdInfo>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.passport' defaultMessage='- Passport' />
      </IdInfo>
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.govid' defaultMessage='- State or government-issued identification card' />
      </IdInfo>
      <IdInfo style={spacing('mt-10 mb-10')}>
        <Banner type='warning'>
          <Text size='12px'>
            <FormattedMessage id='sfoxexchangedata.upload.selfieswarning' defaultMessage='Selfies are not a valid form of ID Verification' />
          </Text>
        </Banner>
      </IdInfo>
    </Fragment>
    : <Fragment>
      <PartnerSubHeader>
        <FormattedMessage id='sfoxexchangedata.upload.address.subtitle' defaultMessage='The document must be dated within the last 6 months, and should clearly display your address.' />
      </PartnerSubHeader>
      <Text weight={400} style={spacing('mt-15')}>
        <FormattedMessage id='sfoxexchangedata.upload.address.id' defaultMessage='2. Proof of Address Verification' />
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
      <IdInfo>
        <FormattedMessage id='sfoxexchangedata.upload.address.govid' defaultMessage='- DMV or voter registration form' />
      </IdInfo>
      <IdInfo style={spacing('mt-10 mb-10')}>
        <Banner type='warning'>
          <Text size='12px'>
            <FormattedMessage id='sfoxexchangedata.upload.addresswarning' defaultMessage="Uploading your passport or driver's license is not sufficient to verify your address." />
          </Text>
        </Banner>
      </IdInfo>
    </Fragment>
)

export default TitleStrings
