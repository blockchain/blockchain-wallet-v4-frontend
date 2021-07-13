import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { AddBankStepType, BankStatusType } from 'data/types'

import { Props as _P, SuccessStateType } from '.'

export type Props = _P & SuccessStateType

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
  position: relative;
  height: 100%;
  display: flex;
`

const CloseIcon = styled(Icon)`
  position: absolute;
  padding: inherit;
  left: 0px;
  top: 0px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const Title = styled(Text)`
  margin: 56px 0 16px 0;
  text-align: center;
`

const Subcontent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`
// This component is shared by Yapily and Yodlee add bank modals
const BankLinkError: React.FC<Props> = ({ bankStatus, brokerageActions, handleClose }) => {
  return (
    <Top>
      <CloseIcon
        cursor
        name='close'
        size='20px'
        color='grey600'
        role='button'
        onClick={handleClose}
      />
      <Container>
        <Image
          width='100px'
          name={
            bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_EXPIRED
              ? 'bank-expired'
              : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED
              ? 'bank-rejected'
              : 'bank-error'
          }
        />
        <Title color='grey800' size='20px' weight={600}>
          {bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_ALREADY_LINKED ? (
            <FormattedMessage
              id='copy.bank_linked_error_title_already_linked'
              defaultMessage='This bank has already been linked to your account.'
            />
          ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_NAME_MISMATCH ? (
            <FormattedMessage
              id='copy.bank_linked_error_title_yourbank'
              defaultMessage='Is this your bank?'
            />
          ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_EXPIRED ? (
            <FormattedMessage
              id='copy.bank_linked_error_title_expiredaccount'
              defaultMessage='Expired Account Access'
            />
          ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED ? (
            <FormattedMessage
              id='copy.bank_linked_error_title_connectionrejected'
              defaultMessage='Connection Rejected'
            />
          ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_FAILED ? (
            <FormattedMessage
              id='copy.bank_linked_error_title_failedconnection'
              defaultMessage='Failed Connection Request'
            />
          ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_INVALID ? (
            <FormattedMessage
              id='scenes.exchange.confirm.oopsheader'
              defaultMessage='Oops! Something went wrong.'
            />
          ) : (
            <FormattedMessage
              id='scenes.exchange.confirm.oopsheader'
              defaultMessage='Oops! Something went wrong.'
            />
          )}
        </Title>
        <Subcontent color='grey600' weight={500}>
          {bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_ALREADY_LINKED ? (
            <>
              <FormattedMessage
                id='copy.bank_linked_error_alreadylinked1'
                defaultMessage='Log into your Exchange account and link your Wallet. This will connect your bank. If any of this doesn’t look right to you, please'
              />{' '}
              <Link
                size='16px'
                weight={500}
                target='_blank'
                href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
              >
                <FormattedMessage id='copy.contact_us' defaultMessage='contact us' />
              </Link>{' '}
              <FormattedMessage
                id='copy.bank_linked_error_alreadylinked2'
                defaultMessage='immediately.'
              />
            </>
          ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_NAME_MISMATCH ? (
            <>
              <FormattedMessage
                id='copy.bank_linked_error_yourbank'
                defaultMessage='We noticed the names don’t match. The bank you link must have a matching legal first & last name as your Blockchain.com Account.'
              />{' '}
              <Link
                size='16px'
                weight={500}
                target='_blank'
                href='https://support.blockchain.com/hc/en-us/'
              >
                <FormattedMessage id='buttons.learn_more_arrow' defaultMessage='Learn more ->' />
              </Link>
            </>
          ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_INVALID ? (
            <>
              <FormattedMessage
                id='copy.bank_linked_error_account_invalid'
                defaultMessage='You’ve tried to link an account which is not valid. Please check again or contact support.'
              />
            </>
          ) : (
            <>
              <FormattedMessage
                id='copy.bank_linked_error'
                defaultMessage='Please try linking your bank again. If this keeps happening, please'
              />{' '}
              <Link
                size='16px'
                weight={500}
                target='_blank'
                href='https://support.blockchain.com/hc/en-us/'
              >
                <FormattedMessage id='buttons.contact_support' defaultMessage='Contact Support' />
              </Link>
              .
            </>
          )}
        </Subcontent>
        <Button
          data-e2e='bankLinkTryAgain'
          height='48px'
          size='16px'
          nature='primary'
          onClick={() =>
            brokerageActions.setAddBankStep({
              addBankStep: AddBankStepType.ADD_BANK
            })
          }
          fullwidth
        >
          <FormattedMessage id='buttons.tryagain' defaultMessage='Try Again' />
        </Button>
        <Button
          data-e2e='bankLinkCancel'
          height='48px'
          size='16px'
          nature='light'
          style={{ marginTop: '16px' }}
          onClick={handleClose}
          fullwidth
        >
          <FormattedMessage id='buttons.cancel_goback' defaultMessage='Cancel & Go Back' />
        </Button>
      </Container>
    </Top>
  )
}

export default BankLinkError
