import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'

import { fiatToString } from '@core/exchange/utils'
import { FiatType } from '@core/types'
import { Button, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { buySell } from 'data/components/actions'
import { getFiatFromPair } from 'data/components/buySell/model'
import { BankTransferAccountType, BuyQuoteStateType } from 'data/types'

import { DropdownItem } from './DropDownItem'
import { BackContainer, Bottom, InfoText, InfoTitle, Wrapper } from './styles'

type Props = {
  bankAccounts: BankTransferAccountType[]
  handleClose: () => void
  quote: BuyQuoteStateType
}

const Success = ({ bankAccounts, handleClose, quote }: Props) => {
  const dispatch = useDispatch()

  const counterAmount = quote.amount
  const counterCurrency = getFiatFromPair(quote.pairObject.pair)
  const bankAccount = bankAccounts.find(
    (bank) => bank.state === 'ACTIVE' && bank.id === quote.paymentMethodId
  )!

  const { attributes, details } = bankAccount ?? {}

  const entityName = attributes?.entity === 'Safeconnect(UK)' ? 'SafeConnect' : 'SafeConnect (UAB)'

  const onApprove = () => {
    dispatch(
      buySell.confirmOrder({
        paymentMethodId: bankAccount.id,
        quoteState: quote
      })
    )
  }

  return (
    <Wrapper>
      <FlyoutWrapper style={{ paddingBottom: '10px' }}>
        <BackContainer>
          <Image name='safe-connect' size='20px' style={{ marginRight: '28px' }} />
          <FormattedMessage
            id='modals.brokerage.authorize.title'
            defaultMessage='{entityName}'
            values={{ entityName }}
          />
        </BackContainer>
      </FlyoutWrapper>
      <FlyoutWrapper style={{ paddingBottom: '16px' }}>
        <Text size='20px' weight={600} color='grey900'>
          <FormattedMessage
            id='modals.brokerage.authrorize.approve'
            defaultMessage='Approve Your Payment'
          />
        </Text>
      </FlyoutWrapper>
      <Row>
        <Title>
          <FormattedMessage
            id='modals.brokerage.authorize.payment_total'
            defaultMessage='Payment Total'
          />
        </Title>
        <Value>
          {fiatToString({
            unit: counterCurrency as FiatType,
            value: counterAmount
          })}
        </Value>
      </Row>
      <DropdownItem
        isPaymentInformation
        titleText='Payment Information'
        bodyText={
          <>
            <Row>
              <InfoText>
                <FormattedMessage
                  id='modals.brokerage.authorize.payer'
                  defaultMessage='Payer Name'
                />
              </InfoText>
              <InfoTitle>{details?.accountName}</InfoTitle>
            </Row>
            <Row>
              <InfoText>
                <FormattedMessage
                  id='modals.brokerage.authorize.sort_code'
                  defaultMessage='Sort Code'
                />
              </InfoText>
              <InfoTitle>{details?.sortCode}</InfoTitle>
            </Row>
            <Row>
              <InfoText>
                <FormattedMessage
                  id='modals.brokerage.account_number'
                  defaultMessage='Account Number'
                />
              </InfoText>
              <InfoTitle>{details?.accountNumber}</InfoTitle>
            </Row>
            <Row>
              <InfoText>
                <FormattedMessage
                  id='modals.brokerage.authorize.payment_reference'
                  defaultMessage='Payment Reference'
                />
              </InfoText>
              <InfoTitle>BLOCKCHAIN</InfoTitle>
            </Row>
            <Row>
              <InfoText>
                <FormattedMessage
                  id='modals.brokerage.authorize.bank_name'
                  defaultMessage='Bank Name'
                />
              </InfoText>
              <InfoTitle>{details?.bankName}</InfoTitle>
            </Row>
          </>
        }
      />
      <DropdownItem
        isPaymentInformation={false}
        bodyText={
          <FormattedMessage
            id='modals.brokertitleage.authorize.data_sharing'
            defaultMessage='{entityName} will retrieve your bank data based on your request and provide this information to Blockchain.com.'
            values={{ entityName }}
          />
        }
        titleText={
          <FormattedMessage
            id='modals.brokerage.authorize.data_sharing'
            defaultMessage='Data Sharing'
          />
        }
      />
      <DropdownItem
        isPaymentInformation={false}
        bodyText={
          <FormattedMessage
            id='modals.brokerage.authorize.secure_connection'
            defaultMessage='Data is securely retrieved in read-only format and only for the duration agreed with you. You have the right to withdraw your consent at any time.'
          />
        }
        titleText={
          <FormattedMessage
            id='modals.brokerage.authorize.secure_connection.title'
            defaultMessage='Secure Connection'
          />
        }
      />
      <DropdownItem
        isPaymentInformation={false}
        bodyText={
          entityName === 'SafeConnect' ? (
            <FormattedMessage
              id='modals.brokerage.authorize.fca'
              defaultMessage='Blockchain.com is an agent of {entityName} Ltd. {entityName} Ltd is authorised and regulated by the Financial Conduct Authority under the Payment Service Regulations 2017 [827001] for the provision of Account Information and Payment Initiation services.'
              values={{ entityName }}
            />
          ) : (
            <FormattedMessage
              id='modals.brokerage.authorize.bol'
              defaultMessage='SafeConnect UAB is authorised and regulated by the Bank of Lithuania under Payments Law (LB002045) for the provision of Account Information and Payment Initiation services.'
            />
          )
        }
        titleText={
          entityName === 'SafeConnect' ? (
            <FormattedMessage
              id='modals.brokerage.authorize.fca.title'
              defaultMessage='FCA Authorisation'
            />
          ) : (
            <FormattedMessage
              id='modals.brokerage.authorize.bol.title'
              defaultMessage='Bank of Lithuania Authorisation'
            />
          )
        }
      />
      <Row>
        <InfoText>
          <FormattedMessage
            id='modals.brokerage.authorize.deposit_data.first'
            defaultMessage='To easily set up payments from your bank to Blockchain.com, we are about to securely re-direct you to your bank where you will be asked to confirm the payment via {entityName}, an FCA regulated payment initiation provider for Blockchain.com.'
            values={{ entityName }}
          />
        </InfoText>
        <InfoText style={{ margin: '15px 0' }}>
          <FormattedMessage
            id='modals.brokerage.authorize.deposit_data.second'
            defaultMessage='{entityName} will share these details with your bank, where you will then be asked to confirm the following payment setup.'
            values={{ entityName }}
          />
        </InfoText>
      </Row>
      <DropdownItem
        isPaymentInformation={false}
        bodyText={
          <>
            <FormattedMessage
              id='modals.brokerage.authorize.about_access'
              defaultMessage='{entityName} will then use these details with Blockchain.com solely for the purposes of buying cryptocurrencies. This consent request is a one-off, you will not receive additional requests once completed.'
              values={{ entityName }}
            />
            {entityName !== 'SafeConnect' && (
              <FormattedMessage
                id='modals.brokerage.authorize.bol.terms'
                defaultMessage='View SafeConnect UAB <a>Terms and Conditions</a> for more information.'
                values={{
                  a: (msg) => (
                    <a href='https://yapi.ly/GDNT' rel='noopener noreferrer' target='_blank'>
                      {msg}
                    </a>
                  )
                }}
              />
            )}
          </>
        }
        titleText={
          <FormattedMessage
            id='modals.brokerage.authorize.about_access.title'
            defaultMessage='About the Access'
          />
        }
      />
      <Row />
      <Bottom>
        <Button
          disabled={!!bankAccount?.id}
          nature='primary'
          data-e2e='obApprove'
          type='submit'
          fullwidth
          height='48px'
          onClick={onApprove}
        >
          <FormattedMessage id='copy.approve' defaultMessage='Approve' />
        </Button>
        <Button
          nature='light-red'
          data-e2e='obDeny'
          type='button'
          fullwidth
          height='48px'
          color='red400'
          style={{ marginTop: '16px' }}
          onClick={handleClose}
        >
          <FormattedMessage id='copy.deny' defaultMessage='Deny' />
        </Button>
      </Bottom>
    </Wrapper>
  )
}

export default Success
