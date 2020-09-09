import { AgentType } from 'core/types'
import {
  DisplayIcon,
  DisplaySubTitle,
  DisplayTitle
} from 'components/SimpleBuy'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import { IcoMoonType } from 'blockchain-info-components/src/Icons/Icomoon'
import { Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import { Props as OwnProps, SuccessStateType } from '.'
import CopyClipboardButton from 'components/CopyClipboardButton'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
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
  justify-content: space-between;
  flex-direction: row;
`

const BackContainer = styled(Text)`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 40px;
  font-weight: 600;
  font-size: 20px;
`

const Bottom = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 24px;
  flex-direction: column;
  height: 100%;
`

const InfoContainer = styled.div`
  margin-top: 16px;
`
const LegalWrapper = styled(TextGroup)`
  margin-top: 20px;
`

const RowCopy = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const BottomInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 41px;
`

const BottomRow = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 16px;
`

const BottomMultiRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.grey800};
  margin-left: 16px;
`

const Copy = styled.div`
  display: flex;
`

const Success: React.FC<Props> = props => {
  return (
    <Wrapper>
      <div>
        <FlyoutWrapper>
          {props.displayBack && (
            <BackContainer>
              <Icon
                cursor
                name='arrow-left'
                size='20px'
                color='grey600'
                style={{ marginRight: '28px' }}
                role='button'
                onClick={() =>
                  props.simpleBuyActions.setStep({
                    step: 'PAYMENT_METHODS',
                    fiatCurrency: props.fiatCurrency || 'USD',
                    pair: props.pair,
                    cryptoCurrency: props.cryptoCurrency || 'BTC',
                    order: props.order
                  })
                }
              />
              <div>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.back'
                  defaultMessage='Back'
                />
              </div>
            </BackContainer>
          )}

          <Icon
            size='32px'
            color='fiat'
            name={props.fiatCurrency.toLowerCase() as keyof IcoMoonType}
          />
          <InfoContainer>
            <TopText color='grey800' size='24px' weight={600}>
              <FormattedMessage
                id='modals.simplebuy.deposit.title'
                defaultMessage='Deposit {currency}'
                values={{
                  currency: Currencies[props.fiatCurrency].displayName
                }}
              />
              {!props.displayBack && (
                <Icon
                  cursor
                  name='close'
                  size='20px'
                  color='grey600'
                  onClick={() => props.handleClose()}
                />
              )}
            </TopText>
            <TopText color='grey600' size='24px' weight={600}>
              <FormattedMessage
                id='modals.simplebuy.deposit.bank_transfer'
                defaultMessage='Bank Transfer'
              />
            </TopText>
          </InfoContainer>
        </FlyoutWrapper>
        {props.fiatCurrency === 'USD' && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.referenceID'
                  defaultMessage='Reference ID (Mandatory)'
                />
              </Title>
              <Value data-e2e='sbReferenceId'>{props.account.address}</Value>
            </div>
            <Copy>
              <CopyClipboardButton address={props.account.address} />
            </Copy>
          </RowCopy>
        )}
        {(props.fiatCurrency === 'USD' || props.fiatCurrency === 'EUR') && (
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
        {props.fiatCurrency === 'EUR' && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.IBAN'
                  defaultMessage='IBAN'
                />
              </Title>
              <Value data-e2e='sbIbanAddress'>{props.account.address}</Value>
            </div>
            <Copy>
              <CopyClipboardButton address={props.account.address} />
            </Copy>
          </RowCopy>
        )}
        {(props.fiatCurrency === 'USD' || props.fiatCurrency === 'GBP') &&
          props.account.agent.account !== '' && (
            <RowCopy>
              <div>
                <Title>
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.account'
                    defaultMessage='Account Number'
                  />
                </Title>
                <Value data-e2e='sbAccountNumber'>
                  {props.account.agent.account}
                </Value>
              </div>
              <Copy>
                <CopyClipboardButton address={props.account.agent.account} />
              </Copy>
            </RowCopy>
          )}
        {props.fiatCurrency === 'GBP' && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.sortcode'
                  defaultMessage='Sort Code'
                />
              </Title>
              <Value data-e2e='sbSortCode'>{props.account.agent.code}</Value>
            </div>
            <Copy>
              <CopyClipboardButton address={props.account.agent.code} />
            </Copy>
          </RowCopy>
        )}
        {props.fiatCurrency === 'EUR' && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.swift'
                  defaultMessage='Bank Code (SWIFT / BIC)'
                />
              </Title>
              <Value data-e2e='sbBankCode'>{props.account.agent.code}</Value>
            </div>
            <Copy>
              <CopyClipboardButton address={props.account.agent.code} />
            </Copy>
          </RowCopy>
        )}
        {props.fiatCurrency === 'USD' && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.routingnumber'
                  defaultMessage='Routing Number'
                />
              </Title>
              <Value data-e2e='sbRoutingNumber'>
                {(props.account.agent as AgentType).routingNumber}
              </Value>
            </div>
            <Copy>
              <CopyClipboardButton
                address={(props.account.agent as AgentType).routingNumber}
              />
            </Copy>
          </RowCopy>
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
        {props.account.currency === 'USD' && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.bankAddress'
                  defaultMessage='Bank Address'
                />
              </Title>
              <Value data-e2e='sbRecipientAddress'>
                {props.account.agent.address}
              </Value>
            </div>
            <Copy>
              <CopyClipboardButton address={props.account.agent.address} />
            </Copy>
          </RowCopy>
        )}
      </div>
      <Bottom>
        <BottomInfoContainer>
          <BottomRow>
            <DisplayIcon>
              <Icon size='18px' color='grey800' name='bank-filled' />
            </DisplayIcon>
            <BottomMultiRowContainer>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.simplebuy.deposit.bank_transfer_only'
                  defaultMessage='Bank Transfers Only'
                />
              </DisplayTitle>
              <DisplaySubTitle>
                <FormattedMessage
                  id='modals.simplebuy.deposit.bank_transfer_only_description'
                  defaultMessage='Only send funds from a bank account in your name. If not, your deposit could be delayed or rejected.'
                />
              </DisplaySubTitle>
            </BottomMultiRowContainer>
          </BottomRow>
          <BottomRow>
            <DisplayIcon>
              <Icon size='18px' color='grey800' name='pending' />
            </DisplayIcon>
            <BottomMultiRowContainer>
              <DisplayTitle>
                <FormattedMessage
                  id='modals.simplebuy.deposit.processing_time'
                  defaultMessage='Processing Time'
                />
              </DisplayTitle>
              <DisplaySubTitle>
                {props.fiatCurrency === 'GBP' && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.gbp'
                    defaultMessage='Funds will be credited to your GBP wallet as soon as we receive them. In the UK Faster Payments Network, this can take a couple of hours.'
                  />
                )}
                {props.fiatCurrency === 'EUR' && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.eur'
                    defaultMessage='Funds will be credited to your EUR wallet as soon as we receive them. SEPA transfers usually take around 1 business day to reach us.'
                  />
                )}
                {props.fiatCurrency === 'USD' && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.usd'
                    defaultMessage='Funds will be credited to your USD wallet as soon as we receive them. Funds are generally available within one business day.'
                  />
                )}
              </DisplaySubTitle>
            </BottomMultiRowContainer>
          </BottomRow>

          {props.fiatCurrency === 'GBP' && (
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
        </BottomInfoContainer>
      </Bottom>
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
