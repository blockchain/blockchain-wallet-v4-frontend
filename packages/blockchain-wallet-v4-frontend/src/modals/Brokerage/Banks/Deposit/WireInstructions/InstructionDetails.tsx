import React from 'react'
import { FormattedMessage } from 'react-intl'
import { AlertCard } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { WalletFiatEnum } from '@core/types'
import { Icon, Link, Text, TextGroup } from 'blockchain-info-components'
import { DisplayIcon, DisplaySubTitle, DisplayTitle } from 'components/BuySell'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'

import { Props as OwnProps, SuccessStateType } from '.'
import { Header } from './Header'

const RowCopy = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const Copy = styled.div`
  display: flex;
`

const Bottom = styled(FlyoutWrapper)`
  display: flex;
  padding-top: 24px;
  flex-direction: column;
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

  > div.constellation {
    width: 100%;
    background: ${(props) => props.theme.grey100} !important;
  }
`
const BottomMultiRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  color: ${(props) => props.theme.grey800};
  margin-left: 16px;
`

type Props = OwnProps &
  SuccessStateType & {
    onClickBack: () => void
  }

export const InstructionDetails: React.FC<Props> = (props) => {
  const formatIbanAddress = (): string => {
    const EVERY_FOUR_CHARS = /(.{4})(?!$)/g
    return props.account.address.replace(EVERY_FOUR_CHARS, `$1 `)
  }

  const recipientName = `${props.userData.firstName} ${props.userData.lastName}`

  return (
    <div>
      <FlyoutWrapper>
        <Header currency={props.account.currency} onClickBack={props.onClickBack} />
      </FlyoutWrapper>

      <div>
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
        {props.account.currency === WalletFiatEnum[WalletFiatEnum.EUR] && (
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
        {props.account.currency === WalletFiatEnum[WalletFiatEnum.GBP] &&
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
      </div>
      <Bottom>
        <BottomInfoContainer>
          <BottomRow>
            <AlertCard
              variant='warning'
              content={
                <FormattedMessage
                  id='modals.simplebuy.deposit.bank_transfer_only_description'
                  defaultMessage='Only send funds from a bank account in your name. If not, your deposit could be delayed or rejected.'
                />
              }
              title={
                <FormattedMessage
                  id='modals.simplebuy.deposit.bank_transfer_only'
                  defaultMessage='Bank Transfers Only'
                />
              }
            />
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
