import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Text, Link } from 'blockchain-info-components'

import PlaidFrame from './iframe.js'
import BankAccounts from './bankAccounts.js'

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`
const ColLeft = styled.div`
  width: 40%;
`
const ColRight = styled.div`
  width: 60%;
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
const Info = styled.div`
  font-size: 14px;
  margin-bottom: 10px;
`
const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const BankLink = (props) => {
  const { plaidUrl, enablePlaid, bankAccounts, onSetBankAccount } = props

  return (
    <Row>
      <ColLeft>
        <ColLeftInner>
          <Title>
            <FormattedMessage id='sfoxexchangedata.link.title' defaultMessage='Link Account' />
          </Title>
          <Subtitle>
            <FormattedMessage id='sfoxexchangedata.link.subtitle' defaultMessage='Sync your bank account instantly by securely signing into your bank directly.' />
          </Subtitle>
          <Info>
            <FormattedMessage id='sfoxexchangedata.link.info' defaultMessage='You can also manually add your account by typing your routing number and account information. Please note that manually adding your bank account could take up to 4 business days to process.' />
          </Info>
          <Info>
            <FormattedMessage id='sfoxexchangedata.link.info2' defaultMessage='(PS: Your bank information will be sent directly to SFOX and will not be viewed by or saved to your Blockchain wallet.)' />
          </Info>
        </ColLeftInner>
      </ColLeft>
      <ColRight>
        <LinkContainer>
          <Text size='14px'>
            <FormattedMessage id='sfoxexchangedata.link.selectmethod' defaultMessage='Select Method To Link Your Bank Account' />
          </Text>
          {
            bankAccounts
            ? <BankAccounts data={bankAccounts.data} onSetBankAccount={onSetBankAccount} />
            : <PlaidFrame enablePlaid={enablePlaid} plaidUrl={plaidUrl} />
          }
        </LinkContainer>
        <Text>
          <Link>
            <FormattedMessage id='sfoxexchangedata.link.manuallyenter' defaultMessage='Manually Enter Account & Routing Information' />
          </Link>
          <FormattedMessage id='sfoxexchangedata.link.fourbusinessdays' defaultMessage='(This can take up to 4 business days)' />
        </Text>
      </ColRight>
    </Row>
  )
}

export default reduxForm({ form: 'sfoxUpload' })(BankLink)
