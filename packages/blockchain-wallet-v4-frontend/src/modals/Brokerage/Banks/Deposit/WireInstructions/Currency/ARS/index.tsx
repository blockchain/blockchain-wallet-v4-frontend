import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { AgentType } from '@core/types'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { Row, Title, Value } from 'components/Flyout'

import { Props as OwnProps, SuccessStateType } from '../..'

const RowCopy = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const Copy = styled.div`
  display: flex;
`

const LayoutArs: React.FC<Props> = (props) => {
  return (
    <div>
      <RowCopy>
        <div>
          <Title>
            <FormattedMessage
              id='modals.simplebuy.transferdetails.bankname'
              defaultMessage='Bank Name'
            />
          </Title>
          <Value data-e2e='sbBankName'>{(props.account.agent as AgentType).bankName}</Value>
        </div>
        <Copy>
          <CopyClipboardButton textToCopy={(props.account.agent as AgentType).bankName} />
        </Copy>
      </RowCopy>
      <RowCopy>
        <div>
          <Title>
            <FormattedMessage id='modals.simplebuy.transferdetails.label' defaultMessage='Alias' />
          </Title>
          <Value data-e2e='sbLabel'>{(props.account.agent as AgentType).label}</Value>
        </div>
        <Copy>
          <CopyClipboardButton textToCopy={(props.account.agent as AgentType).label} />
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
        <Copy>
          <CopyClipboardButton textToCopy={props.account.agent.name} />
        </Copy>
      </RowCopy>
      <RowCopy>
        <div>
          <Title>
            <FormattedMessage id='modals.simplebuy.transferdetails.cuit' defaultMessage='CUIT' />
          </Title>
          <Value data-e2e='sbCuit'>{(props.account.agent as AgentType).holderDocument}</Value>
        </div>
        <Copy>
          <CopyClipboardButton textToCopy={(props.account.agent as AgentType).holderDocument} />
        </Copy>
      </RowCopy>
      {(props.account.agent as AgentType).accountType === 'CBU' ? (
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage id='modals.simplebuy.transferdetails.cbu' defaultMessage='CBU' />
            </Title>
            <Value data-e2e='sbCbu'>{(props.account.agent as AgentType).address}</Value>
          </div>
          <Copy>
            <CopyClipboardButton textToCopy={(props.account.agent as AgentType).address} />
          </Copy>
        </RowCopy>
      ) : (
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage id='modals.simplebuy.transferdetails.cvu' defaultMessage='CVU' />
            </Title>
            <Value data-e2e='sbCvu'>{(props.account.agent as AgentType).address}</Value>
          </div>
          <Copy>
            <CopyClipboardButton textToCopy={(props.account.agent as AgentType).address} />
          </Copy>
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
        <Copy>
          <CopyClipboardButton textToCopy={props.account.agent.code} />
        </Copy>
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
        <Copy>
          <CopyClipboardButton textToCopy={props.account.agent.recipient} />
        </Copy>
      </RowCopy>
    </div>
  )
}

type Props = OwnProps & SuccessStateType

export default LayoutArs
