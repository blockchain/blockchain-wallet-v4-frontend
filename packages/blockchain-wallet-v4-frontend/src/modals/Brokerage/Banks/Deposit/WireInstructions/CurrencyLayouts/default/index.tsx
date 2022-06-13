import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { AgentType, WalletFiatEnum } from '@core/types'
import { Icon, Link, TabMenu, TabMenuItem, Text, TextGroup } from 'blockchain-info-components'
import { DisplayIcon, DisplaySubTitle, DisplayTitle } from 'components/BuySell'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { BankDWStepType } from 'data/types'

import { Props as OwnProps, SuccessStateType } from '../..'
import { TransferType } from '../../types'

const RowCopy = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const Copy = styled.div`
  display: flex;
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
`
const InfoContainer = styled.div`
  margin-top: 16px;
`
const LegalWrapper = styled(TextGroup)`
  margin-top: 20px;
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
  color: ${(props) => props.theme.grey800};
  margin-left: 16px;
`
const TabsContainer = styled.div`
  margin-top: 40px;
  display: inline-block;
`

const LayoutDefault: React.FC<Props> = (props) => {
  const [transferType, setTransferType] = useState(TransferType.DOMESTIC)
  const agent = props.account.agent as AgentType

  const formatIbanAddress = (): string => {
    const EVERY_FOUR_CHARS = /(.{4})(?!$)/g
    return props.account.address.replace(EVERY_FOUR_CHARS, `$1 `)
  }

  const recipientName =
    props.account.currency === WalletFiatEnum[WalletFiatEnum.USD]
      ? props.account.agent.recipient
      : `${props.userData.firstName} ${props.userData.lastName}`

  return (
    <div>
      <FlyoutWrapper>
        <BackContainer>
          <Icon
            cursor
            name='arrow-left'
            size='20px'
            color='grey600'
            style={{ marginRight: '28px' }}
            role='button'
            onClick={() => {
              props.brokerageActions.setDWStep({
                dwStep: BankDWStepType.DEPOSIT_METHODS
              })
            }}
          />
          <div>
            <FormattedMessage
              id='modals.simplebuy.easybanktransfer'
              defaultMessage='Easy Bank Transfer'
            />
          </div>
        </BackContainer>

        <InfoContainer>
          <TopText color='grey800' size='24px' weight={600}>
            {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] ? (
              <FormattedMessage
                id='modals.brokerage.deposit_currency'
                defaultMessage='Deposit {currency}'
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
          </TopText>
          <TopText color='grey600' size='24px' weight={600}>
            {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] ? (
              <FormattedMessage
                id='modals.simplebuy.transferdetails.wire_transfer'
                defaultMessage='Wire Transfer'
              />
            ) : (
              <FormattedMessage
                id='modals.simplebuy.deposit.regular_bank_transfer'
                defaultMessage='Regular Bank Transfer'
              />
            )}
          </TopText>
        </InfoContainer>

        {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] && (
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
      <div>
        {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] && (
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
        {[WalletFiatEnum[WalletFiatEnum.USD], WalletFiatEnum[WalletFiatEnum.EUR]].includes(
          props.account.currency
        ) && (
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
        {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] &&
          transferType === TransferType.INTERNATIONAL && (
            <RowCopy>
              <div>
                <Title>
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.accountType'
                    defaultMessage='Account Type'
                  />
                </Title>
                <Value data-e2e='sbAccountType'>{agent.accountType}</Value>
              </div>
              <Copy>
                <CopyClipboardButton textToCopy={agent.accountType} />
              </Copy>
            </RowCopy>
          )}

        {props.account.currency === WalletFiatEnum[WalletFiatEnum.EUR] && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.IBAN'
                  defaultMessage='IBAN'
                />
              </Title>
              <Value data-e2e='sbIbanAddress'>{formatIbanAddress()}</Value>
            </div>
            <Copy>
              <CopyClipboardButton textToCopy={props.account.address} />
            </Copy>
          </RowCopy>
        )}
        {(props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] ||
          props.account.currency === WalletFiatEnum[WalletFiatEnum.GBP]) &&
          !!props.account.agent.account && (
            <RowCopy>
              <div>
                <Title>
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.account'
                    defaultMessage='Account Number'
                  />
                </Title>
                <Value data-e2e='sbAccountNumber'>{props.account.agent.account}</Value>
              </div>
              <Copy>
                <CopyClipboardButton textToCopy={props.account.agent.account} />
              </Copy>
            </RowCopy>
          )}
        {props.account.currency === WalletFiatEnum[WalletFiatEnum.GBP] && (
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
        {props.account.currency === WalletFiatEnum[WalletFiatEnum.EUR] && (
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
        {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.routingnumber'
                  defaultMessage='Routing Number'
                />
              </Title>
              <Value data-e2e='sbRoutingNumber'>{agent.routingNumber}</Value>
            </div>
            <Copy>
              <CopyClipboardButton textToCopy={agent.routingNumber} />
            </Copy>
          </RowCopy>
        )}
        {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] &&
          transferType === TransferType.INTERNATIONAL && (
            <RowCopy>
              <div>
                <Title>
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.swift.usdInternational'
                    defaultMessage='SWIFT / BIC Code'
                  />
                </Title>
                <Value data-e2e='sbSwiftCode'>{agent.swiftCode}</Value>
              </div>
              <Copy>
                <CopyClipboardButton textToCopy={agent.swiftCode} />
              </Copy>
            </RowCopy>
          )}
        {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] && (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.bankAddress'
                  defaultMessage='Bank Address'
                />
              </Title>
              <Value data-e2e='sbBankAddress'>{agent.address}</Value>
            </div>
            <Copy>
              <CopyClipboardButton textToCopy={agent.address} />
            </Copy>
          </RowCopy>
        )}
        {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] &&
          transferType === TransferType.INTERNATIONAL && (
            <RowCopy>
              <div>
                <Title>
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.recipientAddress'
                    defaultMessage='Recipient Address'
                  />
                </Title>
                <Value data-e2e='sbRecipientAddress'>{agent.recipientAddress}</Value>
              </div>
              <Copy>
                <CopyClipboardButton textToCopy={agent.recipientAddress} />
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
                {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] ? (
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
                {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] ? (
                  <FormattedMessage
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
                {props.account.currency === WalletFiatEnum[WalletFiatEnum.GBP] && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.gbp1'
                    defaultMessage='Funds will be credited to your GBP Account as soon as we receive them. In the UK Faster Payments Network, this can take a couple of hours.'
                  />
                )}
                {props.account.currency === WalletFiatEnum[WalletFiatEnum.EUR] && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.eur1'
                    defaultMessage='Funds will be credited to your EUR Account as soon as we receive them. SEPA transfers usually take around 1 business day to reach us.'
                  />
                )}
                {props.account.currency === WalletFiatEnum[WalletFiatEnum.USD] && (
                  <FormattedMessage
                    id='modals.simplebuy.deposit.processing_time.info.usd1'
                    defaultMessage='Funds will be credited to your USD Account as soon as we receive them. Funds are generally available within one business day.'
                  />
                )}
              </DisplaySubTitle>
            </BottomMultiRowContainer>
          </BottomRow>

          {props.account.currency === WalletFiatEnum[WalletFiatEnum.GBP] && (
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
    </div>
  )
}

type Props = OwnProps & SuccessStateType

export default LayoutDefault
