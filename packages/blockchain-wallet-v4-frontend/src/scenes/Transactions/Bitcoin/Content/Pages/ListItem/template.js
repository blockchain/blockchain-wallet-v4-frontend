import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { Transaction, TransactionRow, TransactionRowAddresses, TransactionRowAmount,
  TransactionRowStatus, TransactionDetailsStatus, TransactionDetailsValue } from 'components/TransactionItem'
import Addresses from './Addresses'
import EditDescription from 'components/EditDescription'
import Confirmation from './Confirmation'
import Fee from './Fee'
import FiatAtTime from './FiatAtTime'
import Status from './Status'

const ToggleButton = styled(Button)`
  align-self: flex-end;
`

const TransactionListItem = (props) => {
  console.info(props)
  const { handleClick, transaction, handleEditDescription } = props

  return (
    <Transaction>
      <TransactionRow>
        <TransactionRowStatus>
          <Status type={transaction.type} />
          <Text size='14px' weight={300}>{transaction.timeFormatted}</Text>
        </TransactionRowStatus>
        <TransactionRowAddresses>
          <Addresses to={transaction.to} from={transaction.from} />
          <EditDescription value={transaction.description} handleConfirm={handleEditDescription} />
        </TransactionRowAddresses>
        <TransactionDetailsStatus>
          <Confirmation confirmations={transaction.confirmations} hash={transaction.hash} />
        </TransactionDetailsStatus>
        <TransactionRowAmount>
          <ToggleButton nature={transaction.type} onClick={handleClick}>
            <SwitchableDisplay coin='BTC' size='16px' weight={300} color='white' cursor='pointer'>{transaction.amount}</SwitchableDisplay>
          </ToggleButton>
          <TransactionDetailsValue>
            <FiatAtTime amount={transaction.amount} hash={transaction.hash} time={transaction.time} />
            <Fee fee={transaction.fee} />
          </TransactionDetailsValue>
        </TransactionRowAmount>
      </TransactionRow>
    </Transaction>
  )
}

TransactionListItem.propTypes = {
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
