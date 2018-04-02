import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Button, HeartbeatLoader } from 'blockchain-info-components'
import BankAccounts from './BankAccounts'
import AddManually from './AddManually'
import MicroDeposits from './MicroDeposits'
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
    handleFullName,
    handleRoutingNumber,
    handleAccountNumber,
    handleAccountType,
    microStep,
    goToMicroDepositStep,
    submitMicroDeposits } = props

  const titleHelper = () => {
    switch (true) {
      case ui.microDeposits: return null
      case ui.selectBank: return <FormattedMessage id='sfoxexchangedata.link.title2' defaultMessage='Select Your Account' />
      case !ui.selectBank: return <FormattedMessage id='sfoxexchangedata.link.title' defaultMessage='Connect Your Bank' />
    }
  }

  const subtitleHelper = () => {
    switch (true) {
      case ui.microDeposits: return null
      case ui.selectBank: return <FormattedMessage id='sfoxexchangedata.link.subtitle2' defaultMessage="Please select which bank account you'd like to have synced with your SFOX profile. Please note: Once this account has been added, you will not be able to change it." />
      case !ui.selectBank: return <FormattedMessage id='sfoxexchangedata.link.subtitle1' defaultMessage='There are two ways to go about this: Sync your bank account using your login details (a crowd favorite), or manually enter your routing and account number (this may take a couple days).' />
    }
  }

  const bankHelper = () => {
    if (ui.toggleManual) {
      return <AddManually
        handleFullName={handleFullName}
        handleRoutingNumber={handleRoutingNumber}
        handleAccountNumber={handleAccountNumber}
        handleAccountType={handleAccountType}
        {...props}
      />
    } else if (bankAccounts) {
      return <BankAccounts data={bankAccounts.data} onSetBankAccount={onSetBankAccount} onBankSelection={handleBankSelection} handleNameChange={onNameChange} />
    } else if (ui.microDeposits) {
      return <MicroDeposits onStep={microStep} />
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

  const buttonHelper = () => {
    if (ui.microDeposits) {
      if (microStep === 'amounts') {
        return (
          <Button nature='primary' uppercase fullwidth onClick={submitMicroDeposits} disabled={ui.busy || invalid}>
            <FormattedMessage id='sfoxexchangedata.link.microdeposits.submitverification' defaultMessage='Submit for Verification' />
          </Button>
        )
      }
      return (
        <Button nature='primary' uppercase fullwidth onClick={() => goToMicroDepositStep('amounts')}>
          <FormattedMessage id='sfoxexchangedata.link.microdeposits.enter' defaultMessage='Enter Deposit Details' />
        </Button>
      )
    }
    if (ui.busy) return <HeartbeatLoader height='20px' width='20px' color='white' />
    return (
      <Button type='submit' nature='primary' uppercase fullwidth disabled={ui.busy || invalid || pristine} >
        <FormattedMessage id='sfoxexchangedata.link.continue' defaultMessage='continue' />
      </Button>
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
          { buttonHelper() }
          { helpersHelper() }
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'sfoxLink' })(BankLink)
