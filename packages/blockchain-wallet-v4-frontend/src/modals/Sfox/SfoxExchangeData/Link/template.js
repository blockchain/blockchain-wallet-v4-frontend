import React, { Fragment } from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Button, HeartbeatLoader, Link, Text } from 'blockchain-info-components'
import BankAccounts from './BankAccounts'
import AddManually from './AddManually'
import MicroDeposits from './MicroDeposits'
import PlaidFrame from './iframe.js'
import AwaitingDeposits from './AwaitingDeposits'
import { Remote } from 'blockchain-wallet-v4/src'

import renderFaq from 'components/FaqDropdown'
import {
  ColLeft,
  ColRight,
  PartnerHeader,
  PartnerSubHeader,
  ColRightInner
} from 'components/IdentityVerification'
import media from 'services/ResponsiveService'
import { equals } from 'ramda'

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: row;
  ${media.mobile`
    flex-direction: column;
  `};
`
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  ${media.mobile`
    width: 100%;
  `};
`
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 75%;
  margin-top: 20px;
  ${media.mobile`
    width: 100%;
    button:last-of-type {
      margin-bottom: 20px;
    }
  `};
`
const FaqWrapper = styled.div``

const OrText = styled.p`
  color: rgba(151, 151, 151, 0.5);
  margin: 10px 0 15px;
  line-height: 0.5;
  text-align: center;
  span {
    display: inline-block;
    position: relative;
  }
  span:before,
  span:after {
    content: '';
    position: absolute;
    height: 5px;
    border-bottom: 1px solid rgba(151, 151, 151, 0.5);
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

const selectBankQuestions = [
  {
    question: (
      <FormattedMessage
        id='scenes.buysell.sfoxsignup.link.helper3.question'
        defaultMessage='How will this account be used?'
      />
    ),
    answer: (
      <FormattedMessage
        id='scenes.buysell.sfoxsignup.link.helper3.answer'
        defaultMessage='This will be the primary account you buy or sell assets with.'
      />
    )
  },
  {
    question: (
      <FormattedMessage
        id='scenes.buysell.sfoxsignup.link.helper4.question'
        defaultMessage='What if I need to change my linked bank account?'
      />
    ),
    answer: (
      <FormattedMessage
        id='scenes.buysell.sfoxsignup.link.helper4.answer'
        defaultMessage='To change account information, or link a new account, please submit a request to support@sfox.com. Make sure you mention Blockchain in the subject and include the information you want to change.'
      />
    )
  }
]

const faqQuestions = [
  {
    question: (
      <FormattedMessage
        id='scenes.buysell.sfoxsignup.link.helper1.question'
        defaultMessage='Can I change my bank account once it’s linked?'
      />
    ),
    answer: (
      <FaqWrapper>
        <FormattedMessage
          id='scenes.buysell.sfoxsignup.link.helper1.answer1'
          defaultMessage='Yes, you can change your bank account by emailing'
        />
        <span>&nbsp;</span>
        <Link href='mailto:support@sfox.com' size='13px' weight={200}>
          <FormattedMessage
            id='scenes.buysell.sfoxsignup.link.helper1.link'
            defaultMessage='support@sfox.com'
          />
        </Link>
        <FormattedMessage
          id='scenes.buysell.sfoxsignup.link.helper1.answer2'
          defaultMessage='. Make sure you mention Blockchain in the subject and include the information you want to change.'
        />
      </FaqWrapper>
    )
  },
  {
    question: (
      <FormattedMessage
        id='scenes.buysell.sfoxsignup.link.helper2.question'
        defaultMessage='Which method of linking my bank takes longer?'
      />
    ),
    answer: (
      <FormattedMessage
        id='scenes.buysell.sfoxsignup.link.helper2.answer1'
        defaultMessage='Adding your account details manually takes longer. In order to verify these details belong to you, SFOX sends 2 micro-deposits to your account. This process can take up to 5 days in itself, so we recommend signing directly into your bank if you would like to buy & sell immediately.'
      />
    )
  }
]

const BankLink = props => {
  const {
    plaidUrl,
    enablePlaid,
    bankAccounts,
    onSetBankAccount,
    microDeposits,
    selectBank,
    addBankManually,
    toggleManual,
    handleSubmit,
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
    busy,
    linkError,
    setNotAsked,
    awaitingDeposits,
    resetAccountHolder
  } = props

  const titleHelper = () => {
    switch (true) {
      case microDeposits:
        return null
      case selectBank:
        return (
          <FormattedMessage
            id='sfoxexchangedata.link.title2'
            defaultMessage='Select Your Account'
          />
        )
      case !selectBank:
        return (
          <FormattedMessage
            id='sfoxexchangedata.link.title'
            defaultMessage='Connect Your Bank'
          />
        )
    }
  }

  const subtitleHelper = () => {
    switch (true) {
      case microDeposits:
        return null
      case selectBank:
        return (
          <FormattedMessage
            id='sfoxexchangedata.link.subtitle2'
            defaultMessage="Please select which bank account you'd like to have synced with your SFOX profile."
          />
        )
      case !selectBank:
        return (
          <FormattedMessage
            id='sfoxexchangedata.link.subtitle1'
            defaultMessage='There are two ways to go about this: Sync your bank account using your login details (a crowd favorite), or manually enter your routing and account number (this may take a couple days).'
          />
        )
    }
  }

  const bankHelper = () => {
    if (addBankManually) {
      return (
        <AddManually
          handleFullName={handleFullName}
          handleRoutingNumber={handleRoutingNumber}
          handleAccountNumber={handleAccountNumber}
          handleAccountType={handleAccountType}
          {...props}
        />
      )
    } else if (Remote.Success.is(bankAccounts)) {
      return (
        <BankAccounts
          data={bankAccounts.getOrElse([])}
          onSetBankAccount={onSetBankAccount}
          onBankSelection={handleBankSelection}
          handleNameChange={onNameChange}
        />
      )
    } else if (microDeposits) {
      return <MicroDeposits onStep={microStep} />
    } else {
      return (
        <ButtonContainer>
          <PlaidFrame enablePlaid={enablePlaid} plaidUrl={plaidUrl} />
          <OrText>
            <FormattedMessage
              id='sfoxexchangedata.link.or'
              defaultMessage='or'
            />
          </OrText>
          <Button onClick={toggleManual}>
            <FormattedMessage
              id='sfoxexchangedata.link.userouting'
              defaultMessage='Use Routing and Account Number'
            />
          </Button>
        </ButtonContainer>
      )
    }
  }

  const helpersHelper = () => {
    if (selectBank) {
      return <Fragment>{renderFaq(selectBankQuestions)}</Fragment>
    }
    return <Fragment>{renderFaq(faqQuestions)}</Fragment>
  }

  const buttonHelper = () => {
    if (microDeposits) {
      if (microStep === 'amounts') {
        return (
          <Button
            nature='primary'
            fullwidth
            onClick={submitMicroDeposits}
            disabled={busy || invalid}
          >
            <FormattedMessage
              id='sfoxexchangedata.link.microdeposits.submitverification'
              defaultMessage='Submit for Verification'
            />
          </Button>
        )
      }
      return (
        <Button
          nature='primary'
          fullwidth
          onClick={() => goToMicroDepositStep('amounts')}
        >
          <FormattedMessage
            id='sfoxexchangedata.link.microdeposits.enter'
            defaultMessage='Enter Deposit Details'
          />
        </Button>
      )
    }
    return (
      <Fragment>
        {linkError ? (
          <Fragment>
            <Text size='13px' weight={300} color='error'>
              {linkError}
            </Text>
            <Link
              size='13px'
              weight={300}
              onClick={() => {
                equals(linkError, 'There was an error linking your bank')
                  ? resetAccountHolder()
                  : toggleManual()
                setNotAsked()
              }}
            >
              <FormattedMessage
                id='sfoxexchangedata.link.tryagain'
                defaultMessage='Try again'
              />
            </Link>
          </Fragment>
        ) : (
          <Button
            type='submit'
            nature='primary'
            fullwidth
            disabled={busy || invalid || pristine}
          >
            {busy ? (
              <HeartbeatLoader height='20px' width='20px' color='white' />
            ) : (
              <FormattedMessage
                id='sfoxexchangedata.button.continue'
                defaultMessage='Continue'
              />
            )}
          </Button>
        )}
        {addBankManually && !linkError ? (
          <GoBackLink onClick={toggleManual}>
            <FormattedMessage
              id='sfoxexchangedata.link.goback'
              defaultMessage='Go Back'
            />
          </GoBackLink>
        ) : null}
      </Fragment>
    )
  }

  if (awaitingDeposits) {
    return <AwaitingDeposits showModal={showModal} />
  }

  return (
    <Form onSubmit={handleSubmit}>
      <ColLeft>
        <HeaderContainer>
          <PartnerHeader>{titleHelper()}</PartnerHeader>
          <PartnerSubHeader>{subtitleHelper()}</PartnerSubHeader>
        </HeaderContainer>
        {bankHelper()}
      </ColLeft>
      <ColRight>
        <ColRightInner>
          {buttonHelper()}
          {helpersHelper()}
        </ColRightInner>
      </ColRight>
    </Form>
  )
}

export default reduxForm({ form: 'sfoxLink' })(BankLink)
