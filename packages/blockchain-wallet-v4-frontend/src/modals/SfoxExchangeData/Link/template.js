import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Button, HeartbeatLoader } from 'blockchain-info-components'
import BankAccounts from './BankAccounts'
import AddManually from './AddManually'
import PlaidFrame from './iframe.js'

import { FAQ1, FAQ2, FAQ3, FAQ4 } from './faq.js'
import { ColLeft, ColRight, PartnerHeader, PartnerSubHeader, ColRightInner } from 'components/BuySell/Signup'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
`
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  margin-bottom: 25px;
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
    onSubmit,
    invalid,
    pristine,
    handleBankSelection,
    onNameChange,
    busy,
    handleFullName,
    handleRoutingNumber,
    handleAccountNumber,
    handleAccountType} = props

  const titleHelper = () => {
    switch (true) {
      case ui.selectBank: return <FormattedMessage id='sfoxexchangedata.link.title2' defaultMessage='Select Your Account' />
      case !ui.selectBank: return <FormattedMessage id='sfoxexchangedata.link.title' defaultMessage='Link Your Bank' />
    }
  }

  const subtitleHelper = () => {
    switch (true) {
      case ui.selectBank: return <FormattedMessage id='sfoxexchangedata.link.subtitle2' defaultMessage="Please select which bank account you'd like to have synced with your SFOX profile. Please note: Once this account has been added, you will not be able to change it." />
      case !ui.selectBank: return <FormattedMessage id='sfoxexchangedata.link.subtitle1' defaultMessage='Link your bank account instantly by signing into your bank with your login details. This method is the fastest. You can also manually add your bank account by typing your routing and account number. This will take up to 4 business days.' />
    }
  }

  const bankHelper = () => {
    if (ui.toggleManual) {
      return <AddManually
        handleFullName={handleFullName}
        handleRoutingNumber={handleRoutingNumber}
        handleAccountNumber={handleAccountNumber}
        handleAccountType={handleAccountType}
      />
    } else if (bankAccounts) {
      return <BankAccounts data={bankAccounts.data} onSetBankAccount={onSetBankAccount} onBankSelection={handleBankSelection} handleNameChange={onNameChange} />
    } else {
      return (
        <ButtonContainer>
          <PlaidFrame enablePlaid={enablePlaid} plaidUrl={plaidUrl} />
          <Button onClick={toggleManual}>
            <FormattedMessage id='sfoxexchangedata.link.userouting' defaultMessage='Use Routing and Account Number' />
          </Button>
        </ButtonContainer>
      )
    }
  }

  const helpersHelper = () => {
    if (ui.selectBank) {
      return (
        <span>
          <FAQ3 />
          <FAQ4 />
        </span>
      )
    }
    return (
      <span>
        <FAQ1 />
        <FAQ2 />
      </span>
    )
  }

  return (
    <Form onSubmit={onSubmit}>
      <ColLeft>
        <HeaderContainer>
          <PartnerHeader>
            { titleHelper() }
          </PartnerHeader>
          <PartnerSubHeader>
            { subtitleHelper() }
          </PartnerSubHeader>
        </HeaderContainer>
        { bankHelper() }
      </ColLeft>
      <ColRight>
        <ColRightInner>
          <Button type='submit' nature='primary' uppercase fullwidth disabled={busy || invalid || pristine} >
            {
              !busy
                ? <FormattedMessage id='sfoxexchangedata.link.continue' defaultMessage='continue' />
                : <HeartbeatLoader height='20px' width='20px' color='white' />
            }
          </Button>
          { helpersHelper() }
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'sfoxLink' })(BankLink)
