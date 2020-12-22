import { Props as _P, SuccessStateType } from '.'
import { Button, Icon, Image, Link, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

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

const BankLinkError: React.FC<Props> = props => {
  const { bankStatus } = props
  return (
    <Top>
      <CloseIcon
        cursor
        name='close'
        size='20px'
        color='grey600'
        role='button'
        onClick={() => props.handleClose}
      />
      <Container>
        <Image width='100px' name='bank-error' />
        <Title color='grey800' size='20px' weight={600}>
          {bankStatus === 'BANK_TRANSFER_ACCOUNT_ALREADY_LINKED' ? (
            <FormattedMessage
              id='copy.bank_linked_error_title_alreadylinked'
              defaultMessage='Sorry,that bank account is linked to the maximum number of Blockchain Wallets.'
            />
          ) : bankStatus === 'BANK_TRANSFER_ACCOUNT_NAME_MISMATCH' ? (
            <FormattedMessage
              id='copy.bank_linked_error_title_yourbank'
              defaultMessage='Is this your bank?'
            />
          ) : (
            <FormattedMessage
              id='scenes.exchange.confirm.oopsheader'
              defaultMessage='Oops! Something went wrong.'
            />
          )}
        </Title>
        <Subcontent color='grey600' weight={500}>
          {bankStatus === 'BANK_TRANSFER_ACCOUNT_ALREADY_LINKED' ? (
            <>
              <FormattedMessage
                id='copy.bank_linked_error_alreadylinked'
                defaultMessage='To link this bank, please log into your other Wallets and remove it. If this doesnt look right to you, please'
              />{' '}
              <Link
                size='16px'
                weight={500}
                target='_blank'
                href='https://support.blockchain.com/hc/en-us/requests/new?ticket_form_id=360000190032'
              >
                <FormattedMessage
                  id='buttons.contact_support'
                  defaultMessage='Contact Support'
                />
              </Link>
              {'.'}
            </>
          ) : bankStatus === 'BANK_TRANSFER_ACCOUNT_NAME_MISMATCH' ? (
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
                <FormattedMessage
                  id='buttons.learn_more_arrow'
                  defaultMessage='Learn more ->'
                />
              </Link>
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
                <FormattedMessage
                  id='buttons.contact_support'
                  defaultMessage='Contact Support'
                />
              </Link>
              {'.'}
            </>
          )}
        </Subcontent>
        <Button
          data-e2e='bankLinkTryAgain'
          height='48px'
          size='16px'
          nature='primary'
          onClick={() => props.simpleBuyActions.handleBankLinkStep()}
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
          onClick={() =>
            props.simpleBuyActions.setStep({
              step: 'CRYPTO_SELECTION',
              fiatCurrency: props.fiatCurrency
            })
          }
          fullwidth
        >
          <FormattedMessage
            id='buttons.cancel_goback'
            defaultMessage='Cancel & Go Back'
          />
        </Button>
      </Container>
    </Top>
  )
}

export default BankLinkError
