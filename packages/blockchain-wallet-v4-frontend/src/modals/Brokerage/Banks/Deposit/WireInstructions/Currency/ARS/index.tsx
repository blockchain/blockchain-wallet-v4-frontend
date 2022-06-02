import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { AgentType } from '@core/types'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { ExpansionPanel } from 'components/ExpansionPanel'
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
  const agent = props.account.agent as AgentType

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
          <Value data-e2e='sbBankName'>{agent.bankName}</Value>
        </div>
      </RowCopy>
      <RowCopy>
        <div>
          <Title>
            <FormattedMessage id='modals.simplebuy.transferdetails.label' defaultMessage='Alias' />
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
                <FormattedMessage id='modals.simplebuy.transferdetails.cbu' defaultMessage='CBU' />
              </Title>
              <Value data-e2e='sbCbu'>{agent.address}</Value>
            </div>
          </RowCopy>
        ) : (
          <RowCopy>
            <div>
              <Title>
                <FormattedMessage id='modals.simplebuy.transferdetails.cvu' defaultMessage='CVU' />
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
  )
}

type Props = OwnProps & SuccessStateType

export default LayoutArs
