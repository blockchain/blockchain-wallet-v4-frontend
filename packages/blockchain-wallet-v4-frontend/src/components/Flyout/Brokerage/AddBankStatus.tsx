import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'
import { FlyoutContainer, FlyoutContent, FlyoutFooter } from 'components/Flyout'
import { BankStatusType } from 'data/types'

const Title = styled(Text)`
  margin: 56px 0 16px 0;
  text-align: center;
`

const Subcontent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`
const AddBankError = ({ bankStatus, handleClose, retryAction }: Props) => {
  return (
    <FlyoutContainer>
      <FlyoutContent mode='middle'>
        <div style={{ padding: '0 40px', textAlign: 'center' }}>
          <Image
            width='100px'
            name={
              bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_EXPIRED
                ? 'bank-expired'
                : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED ||
                  bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_INVALID
                ? 'bank-rejected'
                : bankStatus === BankStatusType.ACTIVE
                ? 'bank-success'
                : 'bank-error'
            }
          />
          <Title color='grey800' size='20px' weight={600}>
            {bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_ALREADY_LINKED ? (
              <FormattedMessage
                id='copy.bank_linked_error_title_already_linked'
                defaultMessage='Account Already Linked'
              />
            ) : bankStatus === BankStatusType.ACTIVE ? (
              <FormattedMessage id='copy.bank_linked.title' defaultMessage='Bank Linked!' />
            ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED_FRAUD ||
              bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_FAILED_INTERNAL ? (
              <FormattedMessage
                id='copy.bank_linked_error_title_rejected_fraud'
                defaultMessage='There was a problem linking your account.'
              />
            ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_NAME_MISMATCH ? (
              <FormattedMessage
                id='copy.bank_linked_error_title_yourbank'
                defaultMessage='Is this your bank?'
              />
            ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_EXPIRED ? (
              <FormattedMessage
                id='copy.bank_linked_error_title_expiredaccount'
                defaultMessage='Access Request Expired'
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
                id='copy.bank_linked_error_title_account_invalid'
                defaultMessage='Invalid Account'
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
                  defaultMessage='We noticed this account is already active on another Wallet. If you believe this is incorrect,'
                />{' '}
                <Link
                  size='16px'
                  weight={500}
                  target='_blank'
                  href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
                >
                  <FormattedMessage id='copy.contact_us' defaultMessage='contact us' />
                </Link>
                .
              </>
            ) : bankStatus === BankStatusType.ACTIVE ? (
              // Put bank name in the title
              <FormattedMessage
                id='copy.bank_linked'
                defaultMessage='Your bank account is now linked to your Blockchain.com Wallet'
              />
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
                  defaultMessage="You've tried to link an invalid account. Please try another account or"
                />{' '}
                <Link
                  size='16px'
                  weight={500}
                  target='_blank'
                  href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
                >
                  <FormattedMessage id='copy.contact_us' defaultMessage='contact us' />
                </Link>
                .
              </>
            ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_EXPIRED ? (
              <>
                <FormattedMessage
                  id='copy.bank_linked_error_account_expired'
                  defaultMessage='The request to pair your account has timed out. Try pairing your account again. If this keeps happening, please'
                />{' '}
                <Link
                  size='16px'
                  weight={500}
                  target='_blank'
                  href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
                >
                  <FormattedMessage id='copy.contact_us' defaultMessage='contact us' />
                </Link>
                .
              </>
            ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_FAILED ? (
              <>
                <FormattedMessage
                  id='copy.bank_linked_error_account_failed'
                  defaultMessage='The request to pair your account has timed out. Try pairing your account again. If this keeps happening, please'
                />{' '}
                <Link
                  size='16px'
                  weight={500}
                  target='_blank'
                  href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
                >
                  <FormattedMessage id='copy.contact_us' defaultMessage='contact us' />
                </Link>
                .
              </>
            ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED_FRAUD ||
              bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_FAILED_INTERNAL ? (
              <>
                <FormattedMessage
                  id='copy.bank_linked_error_rejected_fraud'
                  defaultMessage='Please try again or select a different payment method.'
                />
              </>
            ) : bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_REJECTED ? (
              <>
                <FormattedMessage
                  id='copy.bank_linked_error_account_rejected'
                  defaultMessage="We believe you have declined linking your account. If this isn't correct, please"
                />{' '}
                <Link
                  size='16px'
                  weight={500}
                  target='_blank'
                  href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
                >
                  <FormattedMessage id='copy.contact_us' defaultMessage='contact us' />
                </Link>
                .
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
        </div>
      </FlyoutContent>
      <FlyoutFooter collapsed>
        {bankStatus === BankStatusType.ACTIVE ? (
          <Button
            nature='primary'
            data-e2e='obContinueBankStatus'
            fullwidth
            height='48px'
            onClick={handleClose}
          >
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Button>
        ) : (
          <>
            <Button
              data-e2e='bankLinkTryAgain'
              height='48px'
              size='16px'
              nature='primary'
              onClick={retryAction}
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
          </>
        )}
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

type Props = {
  bankStatus: BankStatusType
  handleClose: () => void
  retryAction: () => void
}

export { AddBankError }
export default AddBankError
