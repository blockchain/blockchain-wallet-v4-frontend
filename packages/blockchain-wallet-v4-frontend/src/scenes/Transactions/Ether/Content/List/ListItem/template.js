import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'

import { Button, ConfirmationGauge, Icon, Tooltip, Text } from 'blockchain-info-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { Transaction, TransactionRow, TransactionRowAddresses, TransactionRowAmount, TransactionRowDescription,
  TransactionRowStatus, TransactionRowToggler, TransactionDetails, TransactionDetailsAddresses,
  TransactionDetailsDescription, TransactionDetailsStatus, TransactionDetailsValue } from 'components/TransactionItem'
import EditDescription from 'components/EditDescription'

const TransactionTooltip = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: space-between;
`

const selectColors = type => {
  switch (type) {
    case 'Sent': return 'sent'
    case 'Transferred': return 'transferred'
    case 'Received': return 'received'
    default: return ''
  }
}

const TransactionListItem = (props) => {
  const { toggled, handleToggle, handleClick, transaction, handleEditDescription } = props
  const now = moment()
  const date = moment.utc(transaction.time * 1000)
  const formattedDate = (date.year() === now.year())
    ? date.format('MMMM D @kk:mm')
    : date.format('MMMM D YYYY @kk:mm')

  return (
    <Transaction>
      <TransactionRow>
        <TransactionRowToggler toggled={toggled} onClick={handleToggle} />
        <TransactionRowStatus>
          <Text weight={500} color={selectColors(transaction.type)} uppercase>
            { transaction.type === 'Sent' && <FormattedMessage id='scenes.transactions.ether.content.list.listitem.sent' defaultMessage='Sent' /> }
            { transaction.type === 'Received' && <FormattedMessage id='scenes.transactions.ether.content.list.listitem.received' defaultMessage='Received' /> }
            { transaction.type === 'Transferred' && <FormattedMessage id='scenes.transactions.ether.content.list.listitem.transferred' defaultMessage='Transferred' /> }
          </Text>
          <Text size='12px' weight={300} italic>{formattedDate}</Text>
        </TransactionRowStatus>
        <TransactionRowAddresses>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.transactions.ether.content.list.listitem.to' defaultMessage='To : {to}' values={{ to: transaction.to }} />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.transactions.ether.content.list.listitem.from' defaultMessage='From : {from}' values={{ from: transaction.from }} />
          </Text>
        </TransactionRowAddresses>
        <TransactionRowDescription>
          {/* { transaction.description !== ''
            ? <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.transactions.ether.content.list.listitem.description' defaultMessage='Description: {description}' values={{ description: transaction.description }} />
              <Icon name='pencil' size='14px' />
            </Text>
            : <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.transactions.ether.content.list.listitem.adddescription' defaultMessage='Add a description' />
              <Icon name='pencil' size='14px' />
            </Text>
          } */}
          <EditDescription value={transaction.description} handleConfirm={handleEditDescription}/>
        </TransactionRowDescription>
        <TransactionRowAmount>
          <Button nature={transaction.type.toLowerCase()} onClick={handleClick} fullwidth>
            <SwitchableDisplay coin='ETH' size='14px' weight={300} color='white'>{transaction.amount}</SwitchableDisplay>
          </Button>
        </TransactionRowAmount>
      </TransactionRow>
      <TransactionDetails toggled={toggled}>
        <TransactionDetailsStatus>
          { transaction.confirmations > 3 && <FormattedMessage id='scenes.transactions.ether.content.list.listitem.transaction_confirmed' defaultMessage='Transaction confirmed' /> }
          { transaction.confirmations <= 3 &&
            <TransactionTooltip>
              <ConfirmationGauge nbConfirmations={transaction.confirmations} />
              <Tooltip>
                {transaction.confirmations === 0 && <FormattedMessage id='scenes.transactions.ether.content.list.listitem.transaction_unconfirmed' defaultMessage='Your transaction is actually unconfirmed.' />}
                {transaction.confirmations === 1 && <FormattedMessage id='scenes.transactions.ether.content.list.listitem.transaction_confirmed_1' defaultMessage='Your transaction confirmation is in progress (1 block ahead).' />}
                {transaction.confirmations === 2 && <FormattedMessage id='scenes.transactions.ether.content.list.listitem.transaction_confirmed_2' defaultMessage='Your transaction confirmation is in progress (2 blocks ahead).' />}
                {transaction.confirmations === 3 && <FormattedMessage id='scenes.transactions.ether.content.list.listitem.transaction_confirmed_3' defaultMessage='Your transaction is confirmed (3 blocks ahead).' />}
              </Tooltip>
            </TransactionTooltip>
          }
        </TransactionDetailsStatus>
        <TransactionDetailsAddresses>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.transactions.ether.content.list.listitem.to' defaultMessage='To : {to}' values={{ to: transaction.to }} />
          </Text>
          <Text size='14px' weight={300}>
            <FormattedMessage id='scenes.transactions.ether.content.list.listitem.from' defaultMessage='From : {from}' values={{ from: transaction.from }} />
          </Text>
        </TransactionDetailsAddresses>
        <TransactionDetailsDescription>
          {transaction.description !== ''
            ? <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.transactions.ether.content.list.listitem.description' defaultMessage='Description: {description}' values={{ description: transaction.description }} />
              <Icon name='pencil' size='14px' />
            </Text>
            : <Text size='14px' weight={300}>
              <FormattedMessage id='scenes.transactions.ether.content.list.listitem.adddescription' defaultMessage='Add a description' />
              <Icon name='pencil' size='14px' />
            </Text>
          }
        </TransactionDetailsDescription>
        <TransactionDetailsValue />
      </TransactionDetails>
    </Transaction>
  )
}

TransactionListItem.propTypes = {
  toggled: PropTypes.bool.isRequired,
  handleToggle: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    type: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    description: PropTypes.string,
    initial_value: PropTypes.string
  })
}

export default TransactionListItem
