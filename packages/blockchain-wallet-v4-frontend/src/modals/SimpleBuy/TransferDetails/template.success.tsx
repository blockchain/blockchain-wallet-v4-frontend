import { Button, Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { FiatType } from 'core/types'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { model } from 'data'
import { Props as OwnProps, SuccessStateType } from '.'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`
const TopText = styled(Text)`
  display: flex;
  align-items: center;
`
const Bottom = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 24px;
  flex-direction: column;
  height: 100%;
`

const OkButton = styled(Button)`
  size: 16px;
  height: 48px;
  margin-top: 24px;
`
const InfoContainer = styled.div`
  margin-top: 16px;
`
const LegalWrapper = styled(TextGroup)`
  margin-top: 20px;
`

const RowTitle = styled(Row)`
  border-top: 0;
  padding-top: 0;
`

const BottomInfoContainer = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${({ theme }) => theme.grey000};
  border-radius: 8px;
  margin-top: 60px;
`

const Success: React.FC<Props> = props => {
  return (
    <Wrapper>
      <div>
        <FlyoutWrapper>
          <TopText color='grey800' size='20px' weight={600}>
            <Icon
              cursor
              name='arrow-left'
              size='20px'
              color='grey600'
              style={{ marginRight: '24px' }}
              role='button'
              onClick={() =>
                props.simpleBuyActions.setStep({
                  step: 'ORDER_SUMMARY',
                  order: props.order
                })
              }
            />
            <FormattedMessage
              id='modals.simplebuy.transferdetails'
              defaultMessage='Transfer Details'
            />
          </TopText>
          <InfoContainer>
            <Text color='grey600' weight={500} size='14px'>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.info_1'
                defaultMessage='Securely transfer {fiatCurrency} from your bank account to Blockchain.com. Depending on the transfer method and availability of funds, this may take up to one business day.'
                values={{
                  fiatCurrency: props.order.inputCurrency
                }}
              />
            </Text>
            {props.account.currency === 'GBP' && (
              <Text
                color='grey600'
                weight={500}
                size='14px'
                style={{ marginTop: '24px' }}
              >
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.info.gbp'
                  defaultMessage='You’ll need to open your bank application in a different tab to transfer the funds.'
                />
              </Text>
            )}
            {props.account.currency === 'EUR' && (
              <Text color='grey600' weight={500} size='14px'>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.info.eur'
                  defaultMessage='You’ll need to log in to your bank account online to transfer funds.'
                />
              </Text>
            )}
          </InfoContainer>
        </FlyoutWrapper>
        {(props.account.currency === 'GBP' ||
          props.account.currency === 'EUR') && (
          <RowTitle>
            <Text color='grey800' weight={700} size='14px'>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.banktransferinfo'
                defaultMessage='Bank Transfer Information'
              />
            </Text>
          </RowTitle>
        )}
        {(props.account.currency === 'USD' ||
          props.account.currency === 'EUR') && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.bankname'
                defaultMessage='Bank Name'
              />
            </Title>
            <Value data-e2e='sbBankName'>{props.account.agent.name}</Value>
          </Row>
        )}
        {props.account.currency === 'EUR' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.bankcountry'
                defaultMessage='Bank Country'
              />
            </Title>
            <Value data-e2e='sbCountryEstonia'>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.estonia'
                defaultMessage='Estonia'
              />
            </Value>
          </Row>
        )}
        {props.account.currency === 'EUR' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.IBAN'
                defaultMessage='IBAN'
              />
            </Title>
            <Value data-e2e='sbIbanAddress'>{props.account.address}</Value>
          </Row>
        )}
        {props.account.currency === 'GBP' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.account'
                defaultMessage='Account Number'
              />
            </Title>
            <Value data-e2e='sbAccountNumber'>
              {props.account.agent.account}
            </Value>
          </Row>
        )}
        {props.account.currency === 'GBP' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.sortcode'
                defaultMessage='Sort Code'
              />
            </Title>
            <Value data-e2e='sbSortCode'>{props.account.agent.code}</Value>
          </Row>
        )}
        {props.account.currency === 'EUR' && (
          <Row>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.swift'
                defaultMessage='Bank Code (SWIFT / BIC)'
              />
            </Title>
            <Value data-e2e='sbBankCode'>{props.account.agent.code}</Value>
          </Row>
        )}
        {props.account.currency === 'USD' && (
          <Row>
            <Title size='14px' weight={500} color='grey600'>
              <FormattedMessage id='copy.address' defaultMessage='Address' />
            </Title>
            <Value data-e2e='sbAddress'>{props.account.agent.address}</Value>
          </Row>
        )}
        {props.account.currency === 'USD' && (
          <Row>
            <Title size='14px' weight={500} color='grey600'>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.routingnumber'
                defaultMessage='Routing Number'
              />
            </Title>
            <Value data-e2e='sbRoutingNumber'>
              {props.account.agent.routingNumber}
            </Value>
          </Row>
        )}
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.transferdetails.recipient'
              defaultMessage='Recipient'
            />
          </Title>
          <Value data-e2e='sbRecipientName'>
            {props.userData.firstName} {props.userData.lastName}
          </Value>
        </Row>
        <Row>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.transferdetails.amount'
              defaultMessage='Amount to Send'
            />
          </Title>
          <Value data-e2e='sbSentAmount'>
            {fiatToString({
              unit: props.order.inputCurrency as FiatType,
              value: convertBaseToStandard('FIAT', props.order.inputQuantity)
            })}
          </Value>
        </Row>
      </div>
      <Bottom>
        <Text size='12px' weight={500} color='grey600'>
          <FormattedMessage
            id='modals.simplebuy.transferdetails.sendfundsfrom'
            defaultMessage='Only send funds from a bank account in your name. If not, your deposit could be delayed or rejected.'
          />
        </Text>
        {props.account.currency === 'GBP' && (
          <LegalWrapper inline>
            <Text size='12px' weight={500} color='grey600'>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.depositagreement'
                defaultMessage='By depositing funds to this account, you agree to {ToS}, our banking partner.'
                values={{
                  ToS: (
                    <Link
                      href='https://exchange.blockchain.com/legal'
                      size='12px'
                      weight={500}
                      rel='noreferrer noopener'
                      target='_blank'
                    >
                      <FormattedMessage
                        id='modals.simplebuy.transferdetails.agree'
                        defaultMessage='Terms and Conditions of Modular'
                      />
                    </Link>
                  )
                }}
              />
            </Text>
          </LegalWrapper>
        )}

        <OkButton
          fullwidth
          nature='primary'
          data-e2e='closeSBTransferDetails'
          onClick={() => props.handleClose()}
        >
          <FormattedMessage
            id='modals.simplebuy.transferdetails.sendfundsfromok'
            defaultMessage='OK'
          />
        </OkButton>
        {(props.account.currency === 'GBP' ||
          props.account.currency === 'EUR') && (
          <BottomInfoContainer>
            <Text size='14px' weight={600} style={{ marginBottom: '8px' }}>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.questionsbanktransfers'
                defaultMessage='Questions on how to make bank transfers?'
              />
            </Text>
            <Text size='14px' weight={500}>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.questionsbanktransfersdesc'
                defaultMessage='We’ve got you covered with a step by step article.'
              />
            </Text>
            <Link
              href='https://support.blockchain.com/hc/en-us/articles/360042141932'
              rel='noopener noreferrer'
              data-e2e='openExchange'
              target='_blank'
              onClick={() =>
                props.analyticsActions.logEvent(
                  model.analytics.SB_EVENTS.CLICK_SUPPORT_ARTICLE
                )
              }
            >
              <Text color='blue600' size='14px' weight={500}>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.readnow'
                  defaultMessage='Read it now.'
                />
              </Text>
            </Link>
          </BottomInfoContainer>
        )}
      </Bottom>
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
