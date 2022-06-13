import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import Currencies from '@core/exchange/currencies'
import { AgentType } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import { DisplayIcon, DisplaySubTitle, DisplayTitle } from 'components/BuySell'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { ExpansionPanel } from 'components/ExpansionPanel'
import { FlyoutWrapper, Row, Title, Value } from 'components/Flyout'
import { BankDWStepType } from 'data/types'

import { Props as OwnProps, SuccessStateType } from '../..'

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

const LayoutUsdArs: React.FC<Props> = (props) => {
  const agent = props.account.agent as AgentType

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
            <FormattedMessage
              id='modals.simplebuy.deposit.title'
              defaultMessage='Deposit {currency}'
              values={{
                currency: Currencies[props.account.currency].displayName
              }}
            />
          </TopText>
          <TopText color='grey600' size='24px' weight={600}>
            <FormattedMessage
              id='modals.simplebuy.deposit.regular_bank_transfer_details'
              defaultMessage='Transfer Details'
            />
          </TopText>
        </InfoContainer>
      </FlyoutWrapper>
      <div>
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.bankname'
                defaultMessage='Bank Name'
              />
            </Title>
            <Value data-e2e='sbBankName'>{agent.bankName}</Value>
          </div>
        </RowCopy>
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.label'
                defaultMessage='Alias'
              />
            </Title>
            <Value data-e2e='sbLabel'>{agent.label}</Value>
          </div>
          <Copy>
            <CopyClipboardButton textToCopy={agent.label} />
          </Copy>
        </RowCopy>
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.accountholder'
                defaultMessage='Account Holder'
              />
            </Title>
            <Value data-e2e='sbAccountHolder'>{props.account.agent.name}</Value>
          </div>
        </RowCopy>
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage id='modals.simplebuy.transferdetails.cuit' defaultMessage='CUIT' />
            </Title>
            <Value data-e2e='sbCuit'>{agent.holderDocument}</Value>
          </div>
        </RowCopy>
        <ExpansionPanel>
          {agent.accountType === 'CBU' ? (
            <RowCopy>
              <div>
                <Title>
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.cbu'
                    defaultMessage='CBU'
                  />
                </Title>
                <Value data-e2e='sbCbu'>{agent.address}</Value>
              </div>
            </RowCopy>
          ) : (
            <RowCopy>
              <div>
                <Title>
                  <FormattedMessage
                    id='modals.simplebuy.transferdetails.cvu'
                    defaultMessage='CVU'
                  />
                </Title>
                <Value data-e2e='sbCvu'>{agent.address}</Value>
              </div>
            </RowCopy>
          )}
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.account'
                  defaultMessage='Account Number'
                />
              </Title>
              <Value data-e2e='sbAccountNumber'>{props.account.agent.code}</Value>
            </div>
          </RowCopy>
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage
                  id='modals.simplebuy.transferdetails.recipient'
                  defaultMessage='Recipient'
                />
              </Title>
              <Value data-e2e='sbRecipientName'>{props.account.agent.recipient}</Value>
            </div>
          </RowCopy>
        </ExpansionPanel>
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
                  id='modals.simplebuy.deposit.bank_transfer_only_description_ars'
                  defaultMessage='Only send funds from a bank account in your name. If not, your deposit could be rejected.'
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
                <FormattedMessage
                  id='modals.simplebuy.deposit.processing_time.info.usdars1'
                  defaultMessage='Funds will be credited to your {currency} wallet as soon as we receive them. Funds are generally available within 3 business days. We will send you a mail with the confirmation.'
                  values={{
                    currency: Currencies[props.account.currency].displayName
                  }}
                />
              </DisplaySubTitle>
            </BottomMultiRowContainer>
          </BottomRow>
        </BottomInfoContainer>
      </Bottom>
    </div>
  )
}

type Props = OwnProps & SuccessStateType

export default LayoutUsdArs
