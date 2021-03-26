import React, { useState } from 'react'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Icon,
  Link,
  TabMenu,
  TabMenuItem,
  Text,
  TextGroup
} from 'blockchain-info-components'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import { AgentType } from 'blockchain-wallet-v4/src/types'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import {
  DisplayIcon,
  DisplaySubTitle,
  DisplayTitle
} from 'components/SimpleBuy'

import { Props as OwnProps, SuccessStateType } from '.'
import { TransferType } from './types'

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

const TabsContainer = styled.div`
  margin-top: 40px;
  display: inline-block;
`

const Success: React.FC<Props> = props => {
  const [transferType, setTransferType] = useState(TransferType.DOMESTIC)

  const recipientName =
    props.account.currency === 'USD'
      ? props.account.agent.recipient
      : `${props.userData.firstName} ${props.userData.lastName}`

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
                    fiatCurrency: props.account.currency || 'USD',
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

          <Icon size='32px' color='USD' name={props.account.currency} />
          <InfoContainer>
            <TopText color='grey800' size='24px' weight={600}>
              {props.account.currency === 'USD' || props.addBank ? (
                <FormattedMessage
                  id='modals.simplebuy.deposit.title_add'
                  defaultMessage='Add a {currency} Bank'
                  values={{
                    currency: props.account.currency
                  }}
                />
              ) : (
                <FormattedMessage
                  id='modals.simplebuy.deposit.title'
                  defaultMessage='Deposit {currency}'
                  values={{
                    currency: Currencies[props.account.currency].displayName
                  }}
                />
              )}
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
              {props.account.currency === 'USD' ? (
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.wire_transfer'
                  defaultMessage='Wire Transfer'
                />
              ) : (
                <FormattedMessage
                  id='modals.simplebuy.deposit.bank_transfer'
                  defaultMessage='Bank Transfer'
                />
              )}
            </TopText>

            {props.addBank && (
              <Text size='16px' weight={500} color='grey600'>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.bank_link_info1'
                  defaultMessage='To link your bank, send {symbol}1 or more to your {currency} Account.'
                  values={{
                    currency: props.account.currency,
                    symbol:
                      Currencies[props.account.currency].units[
                        props.account.currency
                      ].symbol
                  }}
                />
              </Text>
            )}
          </InfoContainer>

          {props.account.currency === 'USD' && (
            <TabsContainer>
              <TabMenu>
                <TabMenuItem
                  role='button'
                  selected={transferType === TransferType.DOMESTIC}
                  onClick={() => setTransferType(TransferType.DOMESTIC)}
                  data-e2e='sbDomesticButton'
                >
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.domestic'
                    defaultMessage='Domestic'
                  />
                </TabMenuItem>

                <TabMenuItem
                  role='button'
                  selected={transferType === TransferType.INTERNATIONAL}
                  onClick={() => setTransferType(TransferType.INTERNATIONAL)}
                  data-e2e='sbInternationalButton'
                >
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.international'
                    defaultMessage='International'
                  />
                </TabMenuItem>
              </TabMenu>
            </TabsContainer>
          )}
        </FlyoutWrapper>
        {props.account.currency === 'USD' && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.referenceID'
                  defaultMessage='Reference ID (Required)'
                />
              </Title>
              <Value data-e2e='sbReferenceId'>{props.account.address}</Value>
            </div>
            <Copy>
              <CopyClipboardButton textToCopy={props.account.address} />
            </Copy>
          </RowCopy>
        )}
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.recipient'
                defaultMessage='Recipient'
              />
            </Title>
            <Value data-e2e='sbRecipientName'>{recipientName}</Value>
          </div>
          <Copy>
            <CopyClipboardButton textToCopy={recipientName} />
          </Copy>
        </RowCopy>
        {(props.account.currency === 'USD' ||
          props.account.currency === 'EUR') && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.bankname'
                  defaultMessage='Bank Name'
                />
              </Title>
              <Value data-e2e='sbBankName'>{props.account.agent.name}</Value>
            </div>
            <Copy>
              <CopyClipboardButton textToCopy={props.account.agent.name} />
            </Copy>
          </RowCopy>
        )}

        {props.account.currency === 'USD' &&
          transferType === TransferType.INTERNATIONAL && (
            <RowCopy>
              <div>
                <Title>
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.accountType'
                    defaultMessage='Account Type'
                  />
                </Title>
                <Value data-e2e='sbAccountType'>
                  {props.account.agent.accountType}
                </Value>
              </div>
              <Copy>
                <CopyClipboardButton
                  textToCopy={props.account.agent.accountType}
                />
              </Copy>
            </RowCopy>
          )}

        {props.account.currency === 'EUR' && (
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
              <CopyClipboardButton textToCopy={props.account.address} />
            </Copy>
          </RowCopy>
        )}
        {(props.account.currency === 'USD' ||
          props.account.currency === 'GBP') &&
          !!props.account.agent.account && (
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
                <CopyClipboardButton textToCopy={props.account.agent.account} />
              </Copy>
            </RowCopy>
          )}
        {props.account.currency === 'GBP' && (
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
              <CopyClipboardButton textToCopy={props.account.agent.code} />
            </Copy>
          </RowCopy>
        )}
        {props.account.currency === 'EUR' && (
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
              <CopyClipboardButton textToCopy={props.account.agent.code} />
            </Copy>
          </RowCopy>
        )}
        {props.account.currency === 'USD' && (
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
                textToCopy={(props.account.agent as AgentType).routingNumber}
              />
            </Copy>
          </RowCopy>
        )}
        {props.account.currency === 'USD' &&
          transferType === TransferType.INTERNATIONAL && (
            <RowCopy>
              <div>
                <Title>
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.swift.usdInternational'
                    defaultMessage='SWIFT / BIC Code'
                  />
                </Title>
                <Value data-e2e='sbSwiftCode'>
                  {props.account.agent.swiftCode}
                </Value>
              </div>
              <Copy>
                <CopyClipboardButton
                  textToCopy={props.account.agent.swiftCode}
                />
              </Copy>
            </RowCopy>
          )}
        {props.account.currency === 'USD' && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.bankAddress'
                  defaultMessage='Bank Address'
                />
              </Title>
              <Value data-e2e='sbBankAddress'>
                {props.account.agent.address}
              </Value>
            </div>
            <Copy>
              <CopyClipboardButton textToCopy={props.account.agent.address} />
            </Copy>
          </RowCopy>
        )}
        {props.account.currency === 'USD' &&
          transferType === TransferType.INTERNATIONAL && (
            <RowCopy>
              <div>
                <Title>
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.recipientAddress'
                    defaultMessage='Recipient Address'
                  />
                </Title>
                <Value data-e2e='sbRecipientAddress'>
                  {props.account.agent.recipientAddress}
                </Value>
              </div>
              <Copy>
                <CopyClipboardButton
                  textToCopy={props.account.agent.recipientAddress}
                />
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
                {props.account.currency === 'USD' ? (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.important_transfer_only'
                    defaultMessage='Important Transfer Information'
                  />
                ) : (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.bank_transfer_only'
                    defaultMessage='Bank Transfers Only'
                  />
                )}
              </DisplayTitle>
              <DisplaySubTitle>
                {props.account.currency === 'USD' ? (
                  <FormattedHTMLMessage
                    id='modals.simplebuy.deposit.important_transfer_only_description'
                    defaultMessage='Only send funds from a bank account in your name. If not, your deposit could be delayed or rejected. <b>Be sure to include your Reference ID.</b>'
                  />
                ) : (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.bank_transfer_only_description'
                    defaultMessage='Only send funds from a bank account in your name. If not, your deposit could be delayed or rejected.'
                  />
                )}
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
                {props.account.currency === 'GBP' && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.gbp1'
                    defaultMessage='Funds will be credited to your GBP Account as soon as we receive them. In the UK Faster Payments Network, this can take a couple of hours.'
                  />
                )}
                {props.account.currency === 'EUR' && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.eur1'
                    defaultMessage='Funds will be credited to your EUR Account as soon as we receive them. SEPA transfers usually take around 1 business day to reach us.'
                  />
                )}
                {props.account.currency === 'USD' && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.usd1'
                    defaultMessage='Funds will be credited to your USD Account as soon as we receive them. Funds are generally available within one business day.'
                  />
                )}
              </DisplaySubTitle>
            </BottomMultiRowContainer>
          </BottomRow>

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
        </BottomInfoContainer>
      </Bottom>
    </Wrapper>
  )
}

type Props = OwnProps & SuccessStateType

export default Success
