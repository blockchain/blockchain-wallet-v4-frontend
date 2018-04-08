import React from 'react'
import PropTypes from 'prop-types'

import { Button, Text } from 'blockchain-info-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { Transaction, TransactionRow, TransactionRowAddresses, TransactionRowAmount, TransactionRowDescription,
  TransactionRowStatus, TransactionRowToggler, TransactionDetails, TransactionDetailsAddresses,
  TransactionDetailsDescription, TransactionDetailsStatus, TransactionDetailsValue } from 'components/TransactionItem'
import Addresses from './Addresses'
import EditDescription from 'components/EditDescription'
import Confirmation from './Confirmation'
import Fee from './Fee'
import Status from './Status'

const TransactionListItem = (props) => {
  const { toggled, handleToggle, handleClick, transaction, handleEditDescription } = props

  return (
    <Transaction>
      <TransactionRow>
        <TransactionRowToggler toggled={toggled} onClick={handleToggle} />
        <TransactionRowStatus>
          <Status type={transaction.type} />
          <Text size='12px' weight={300} italic>{transaction.timeFormatted}</Text>
        </TransactionRowStatus>
        <TransactionRowAddresses>
          <Addresses to={transaction.to} from={transaction.from} />
        </TransactionRowAddresses>
        <TransactionRowDescription>
          <EditDescription value={transaction.description} handleConfirm={handleEditDescription} />
        </TransactionRowDescription>
        <TransactionRowAmount>
          <Button nature={transaction.type} onClick={handleClick} fullwidth>
            <SwitchableDisplay coin='BCH' size='16px' weight={300} color='white'>{transaction.amount}</SwitchableDisplay>
          </Button>
        </TransactionRowAmount>
      </TransactionRow>
      { toggled &&
        <TransactionDetails toggled={toggled}>
          <TransactionDetailsStatus>
            <Confirmation confirmations={transaction.confirmations} hash={transaction.hash} />
          </TransactionDetailsStatus>
          <TransactionDetailsAddresses>
            <Addresses to={transaction.to} from={transaction.from} />
          </TransactionDetailsAddresses>
          <TransactionDetailsDescription>
            <EditDescription value={transaction.description} />
          </TransactionDetailsDescription>
          <TransactionDetailsValue>
            <Fee fee={transaction.fee} />
          </TransactionDetailsValue>
        </TransactionDetails>
      }
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
    status: PropTypes.string,
    initial_value: PropTypes.string
  })
}

export default TransactionListItem
