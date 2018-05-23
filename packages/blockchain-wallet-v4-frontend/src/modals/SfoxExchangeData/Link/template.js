import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Button, HeartbeatLoader, Link } from 'blockchain-info-components'
import BankAccounts from './BankAccounts'
import AddManually from './AddManually'
import MicroDeposits from './MicroDeposits'
import PlaidFrame from './iframe.js'
import AwaitingDeposits from './AwaitingDeposits'

import Helper from 'components/BuySell/FAQ'
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
  margin-top: 20px;
`
const OrText = styled.p`
  color: rgba(151,151,151,0.5);
  margin: 10px 0px 15px 0px;
  line-height: 0.5;
  text-align: center;
  span {
    display: inline-block;
    position: relative;
  }
  span:before,
  span:after {
    content: "";
    position: absolute;
    height: 5px;
    border-bottom: 1px solid rgba(151,151,151,0.5);
    top: 0;
    width: 100px;
  }
  span:before {
    right: 100%;
    margin-right: 15px;
  }
  span:after {
    left: 100%;
    margin-left: 15px;
  }
`
const GoBackLink = styled(Link)`
  font-weight: 300;
  font-size: 13px;
  margin-top: 15px;
  display: flex;
  justify-content: center;
`

const selectBankFaqs = [
  {
    question: <FormattedMessage id='sfoxsignup.link.helper3.question' defaultMessage='How will this account be used?' />,
    answer: <FormattedMessage id='sfoxsignup.link.helper3.answer' defaultMessage='Answer3 placeholder' />
  },
  {
    question: <FormattedMessage id='sfoxsignup.link.helper4.question' defaultMessage='Can I change this later?' />,
    answer: <FormattedMessage id='sfoxsignup.link.helper4.answer' defaultMessage='Answer4 placeholder' />
  }
]

const faqList = [
  {
    question: <FormattedMessage id='sfoxsignup.link.helper1.question' defaultMessage='How is my payment method used?' />,
    answer: <FormattedMessage id='sfoxsignup.link.helper1.answer' defaultMessage='Answer1 placeholder' />
  },
  {
    question: <FormattedMessage id='sfoxsignup.link.helper2.question' defaultMessage='Are there transaction fees?' />,
    answer: <FormattedMessage id='sfoxsignup.link.helper2.answer' defaultMessage='Answer2 placeholder' />
  }
]

const selectBankFaqHelper = () => selectBankFaqs.map(el => <Helper question={el.question} answer={el.answer} />)
const faqListHelper = () => faqList.map(el => <Helper question={el.question} answer={el.answer} />)

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
    submitMicroDeposits,
    showModal,
    awaitingDeposits } = props

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
          <OrText>
            <FormattedMessage id='sfoxexchangedata.link.or' defaultMessage='or' />
          </OrText>
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
        <React.Fragment>
          { selectBankFaqHelper() }
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        { faqListHelper() }
      </React.Fragment>
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
    return (
      <Fragment>
        <Button type='submit' nature='primary' uppercase fullwidth disabled={ui.busy || invalid || pristine} >
          {
            ui.busy
              ? <HeartbeatLoader height='20px' width='20px' color='white' />
              : <FormattedMessage id='sfoxexchangedata.link.continue' defaultMessage='continue' />
          }
        </Button>
        {
          ui.toggleManual
            ? <GoBackLink onClick={toggleManual}>
              <FormattedMessage id='sfoxexchangedata.link.goback' defaultMessage='Go Back' />
            </GoBackLink>
            : null
        }
      </Fragment>
    )
  }

  if (awaitingDeposits) {
    return <AwaitingDeposits showModal={showModal} />
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
