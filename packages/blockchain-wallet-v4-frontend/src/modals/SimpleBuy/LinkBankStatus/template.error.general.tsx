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
          {bankStatus === 'DEFAULT_ERROR' && (
            <FormattedMessage
              id='scenes.exchange.confirm.oopsheader'
              defaultMessage='Oops! Something went wrong.'
            />
          )}
          {bankStatus === 'BANK_TRANSFER_ACCOUNT_INFO_NOT_FOUND' && (
            <FormattedMessage
              id='copy.bank_linked_error_checkingtitle'
              defaultMessage='Please link a Checking Account.'
            />
          )}
          {bankStatus === 'BANK_TRANSFER_ACCOUNT_NAME_MISMATCH' && (
            <FormattedMessage
              id='copy.bank_linked_error_title_yourbank'
              defaultMessage='Is this your bank?'
            />
          )}
        </Title>
        <Subcontent color='grey600' weight={500}>
          {bankStatus === 'DEFAULT_ERROR' && (
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
          {bankStatus === 'BANK_TRANSFER_ACCOUNT_INFO_NOT_FOUND' && (
            <FormattedMessage
              id='copy.bank_linked_error_checking'
              defaultMessage='Your bank may charge you extra fees if you buy cyrpto without a checking account.'
            />
          )}
          {bankStatus === 'BANK_TRANSFER_ACCOUNT_NAME_MISMATCH' && (
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
          )}
        </Subcontent>
        <Button
          data-e2e='bankLinkTryAgain'
          height='48px'
          size='16px'
          nature='primary'
          onClick={() =>
            props.simpleBuyActions.setStep({ step: 'LINK_BANK_HANDLER' })
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
          onClick={() =>
            props.simpleBuyActions.setStep({
              step: 'PAYMENT_METHODS',
              fiatCurrency: props.fiatCurrency,
              // @ts-ignore
              pair: props.order.pair,
              cryptoCurrency: props.cryptoCurrency,
              order: props.order
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
