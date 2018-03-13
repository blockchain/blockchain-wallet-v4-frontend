import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Text, Button } from 'blockchain-info-components'

import PlaidFrame from './iframe.js'
import BankAccounts from './bankAccounts.js'
import AddManually from './addManually.js'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
`
const ColLeft = styled.div`
  width: 50%;
`
const ColRight = styled.div`
  width: 50%;
`
const PartnerHeader = styled.div`
  font-size: 30px;
  font-weight: 600;
`
const PartnerSubHeader = styled.div`
  margin-top: 5px;
  font-size: 14px;
`
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  margin-bottom: 25px;
`
const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const ManualLinkText = styled.span`
  display: flex;
  flex-direction: row;
  font-size: 13px;
  align-items: center;
  margin-top: 10px;
  a:first-of-type {
    color: ${props => props.theme['brand-secondary']};
    cursor: pointer;
    span {
      color: #545456;
      cursor: default;
    }
  }
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
`

const BankLink = (props) => {
  const {
    plaidUrl,
    enablePlaid,
    bankAccounts,
    onSetBankAccount,
    ui,
    toggleManual,
    setBankManually,
    onSubmit,
    invalid,
    pristine } = props

  return (
    <Form onSubmit={onSubmit}>
      <ColLeft>
        <HeaderContainer>
          <PartnerHeader>
            <FormattedMessage id='sfoxexchangedata.link.title' defaultMessage='Link Your Bank' />
          </PartnerHeader>
          <PartnerSubHeader>
            <FormattedMessage id='sfoxexchangedata.link.subtitle' defaultMessage='Link your bank account instantly by signing into your bank with your login details. This method is the fastest. You can also manually add your bank account by typing your routing and account number. This will take up to 4 business days.' />
          </PartnerSubHeader>
        </HeaderContainer>
        <ButtonContainer>
          <PlaidFrame enablePlaid={enablePlaid} plaidUrl={plaidUrl} />
          <Button>
            <FormattedMessage id='sfoxexchangedata.link.userouting' defaultMessage='Use Routing and Account Number' />
          </Button>
        </ButtonContainer>
      </ColLeft>
      <ColRight>
        <Button disabled={invalid || pristine} nature='primary' uppercase>
          Continue
        </Button>
        {/* <LinkContainer>
          <Text size='14px'>
            <FormattedMessage id='sfoxexchangedata.link.selectmethod' defaultMessage='Select Method To Link Your Bank Account' />
          </Text>
          {
            bankAccounts
              ? <BankAccounts data={bankAccounts.data} onSetBankAccount={onSetBankAccount} />
              : <PlaidFrame enablePlaid={enablePlaid} plaidUrl={plaidUrl} />
          }
        </LinkContainer>
        <ManualLinkText>
          <a onClick={toggleManual}>Or Manually Enter Account & Routing Information&nbsp;
          <span>(This can take up to 4 business days)</span>
          </a>
        </ManualLinkText>
        {
          ui.toggleManual
            ? <AddManually onSetBankManually={setBankManually} />
            : null
        } */}
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'sfoxLink' })(BankLink)
