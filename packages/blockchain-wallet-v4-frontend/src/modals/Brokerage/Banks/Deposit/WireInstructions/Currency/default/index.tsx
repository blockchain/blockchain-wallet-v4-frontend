import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { AgentType } from '@core/types'
import CopyClipboardButton from 'components/Clipboard/CopyClipboardButton'
import { Row, Title, Value } from 'components/Flyout'

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

const LayoutDefault: React.FC<Props> = (props) => {
  const [transferType] = useState(TransferType.DOMESTIC)

  const formatIbanAddress = (): string => {
    const EVERY_FOUR_CHARS = /(.{4})(?!$)/g
    return props.account.address.replace(EVERY_FOUR_CHARS, `$1 `)
  }

  const recipientName =
    props.account.currency === 'USD'
      ? props.account.agent.recipient
      : `${props.userData.firstName} ${props.userData.lastName}`

  return (
    <div>
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
      {['USD', 'EUR'].includes(props.account.currency) && (
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
      {props.account.currency === 'USD' && transferType === TransferType.INTERNATIONAL && (
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.accountType'
                defaultMessage='Account Type'
              />
            </Title>
            <Value data-e2e='sbAccountType'>{props.account.agent.accountType}</Value>
          </div>
          <Copy>
            <CopyClipboardButton textToCopy={props.account.agent.accountType} />
          </Copy>
        </RowCopy>
      )}

      {props.account.currency === 'EUR' && (
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage id='modals.simplebuy.transferdetails.IBAN' defaultMessage='IBAN' />
            </Title>
            <Value data-e2e='sbIbanAddress'>{formatIbanAddress()}</Value>
          </div>
          <Copy>
            <CopyClipboardButton textToCopy={props.account.address} />
          </Copy>
        </RowCopy>
      )}
      {(props.account.currency === 'USD' || props.account.currency === 'GBP') &&
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
            <CopyClipboardButton textToCopy={(props.account.agent as AgentType).routingNumber} />
          </Copy>
        </RowCopy>
      )}
      {props.account.currency === 'USD' && transferType === TransferType.INTERNATIONAL && (
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.swift.usdInternational'
                defaultMessage='SWIFT / BIC Code'
              />
            </Title>
            <Value data-e2e='sbSwiftCode'>{props.account.agent.swiftCode}</Value>
          </div>
          <Copy>
            <CopyClipboardButton textToCopy={props.account.agent.swiftCode} />
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
            <Value data-e2e='sbBankAddress'>{props.account.agent.address}</Value>
          </div>
          <Copy>
            <CopyClipboardButton textToCopy={props.account.agent.address} />
          </Copy>
        </RowCopy>
      )}
      {props.account.currency === 'USD' && transferType === TransferType.INTERNATIONAL && (
        <RowCopy>
          <div>
            <Title>
              <FormattedMessage
                id='modals.simplebuy.transferdetails.recipientAddress'
                defaultMessage='Recipient Address'
              />
            </Title>
            <Value data-e2e='sbRecipientAddress'>{props.account.agent.recipientAddress}</Value>
          </div>
          <Copy>
            <CopyClipboardButton textToCopy={props.account.agent.recipientAddress} />
          </Copy>
        </RowCopy>
      )}
    </div>
  )
}

type Props = OwnProps & SuccessStateType

export default LayoutDefault
