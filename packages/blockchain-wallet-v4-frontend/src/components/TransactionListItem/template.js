import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import Addresses from './Addresses'
import Description from './Description'
import Confirmations from './Confirmations'
import Fee from './Fee'
import FiatAtTime from './FiatAtTime'
import Status from './Status'

const TransactionRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme['gray-2']};
`
const TransactionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`
const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 15%;
`
const DetailsColumn = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 35%;

  @media(min-width: 992px) { display: flex; }
`
const ConfirmationColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;

  @media(min-width: 1200px) { width: 20%; }
`
const AmountColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 20%;
  min-width: 200px;
`
const TransactionValues = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 8px;

  @media(min-width: 1200px) { width: auto; }
`
const ToggleButton = styled(Button)`
  align-self: flex-end;
`

const TransactionListItem = (props) => {
  const { handleClick, transaction, handleEditDescription, coin, minConfirmations } = props

  return (
    <TransactionRowContainer>
      <TransactionRow>
        <StatusColumn>
          <Status type={transaction.type} />
          <Text size='13px' weight={300}>{transaction.timeFormatted}</Text>
        </StatusColumn>
        <DetailsColumn>
          <Addresses to={transaction.to} from={transaction.from} />
          <Description value={transaction.description} handleConfirm={handleEditDescription} />
        </DetailsColumn>
        <ConfirmationColumn>
          <Confirmations confirmations={transaction.confirmations} minConfirmations={minConfirmations} hash={transaction.hash} />
        </ConfirmationColumn>
        <AmountColumn>
          <ToggleButton nature={transaction.type} onClick={handleClick}>
            <SwitchableDisplay coin={coin} size='16px' weight={300} color='white' cursor='pointer'>{transaction.amount}</SwitchableDisplay>
          </ToggleButton>
          <TransactionValues>
            { coin === 'BTC' && <FiatAtTime amount={transaction.amount} hash={transaction.hash} time={transaction.time} type={transaction.type}/> }
            { transaction.type !== 'received' && <Fee fee={transaction.fee} coin={coin} /> }
          </TransactionValues>
        </AmountColumn>
      </TransactionRow>
    </TransactionRowContainer>
  )
}

TransactionListItem.propTypes = {
  coin: PropTypes.string.isRequired,
  minConfirmations: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    type: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    time: PropTypes.number.isRequired,
    to: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    initial_value: PropTypes.string,
    fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
}

export default TransactionListItem
