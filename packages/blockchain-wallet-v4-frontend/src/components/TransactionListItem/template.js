import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Banner, Button, Text } from 'blockchain-info-components'
import SwitchableDisplay from 'components/Display/SwitchableDisplay'
import { FormattedMessage } from 'react-intl'
import Addresses from './Addresses'
import Description from './Description'
import Confirmations from './Confirmations'
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
const BannerWrapper = styled.div`
  margin-top: 5px;
`
const DetailsColumn = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  white-space: nowrap;
  overflow: hidden;
  width: 35%;

  @media(min-width: 992px) { display: flex; }
`
const ConfirmationColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 20%;

  * { white-space: nowrap; }
  @media(min-width: 1200px) { width: 15%; }
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

const FeeWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  > *:first-child {
    margin-right: 3px;
  }
`

const TransactionListItem = (props) => {
  const { handleCoinToggle, transaction, handleEditDescription, coin, minConfirmations } = props

  return (
    <TransactionRowContainer>
      <TransactionRow>
        <StatusColumn>
          <Status type={transaction.type} />
          <Text size='13px' weight={300}>{transaction.timeFormatted}</Text>
          { (transaction.fromWatchOnly || transaction.toWatchOnly) && (
            <BannerWrapper>
              <Banner type='informational' label>
                <FormattedMessage id='components.txlistitem.watch_only' defaultMessage='Watch Only' />
              </Banner>
            </BannerWrapper>
          )}
        </StatusColumn>
        <DetailsColumn>
          <Addresses to={transaction.to} from={transaction.from} inputs={transaction.inputs} outputs={transaction.outputs} coin={coin} />
          <Description value={transaction.description} handleEditDescription={handleEditDescription} />
        </DetailsColumn>
        <ConfirmationColumn>
          <Confirmations coin={coin} confirmations={transaction.confirmations} minConfirmations={minConfirmations} hash={transaction.hash} />
        </ConfirmationColumn>
        <AmountColumn>
          <ToggleButton nature={transaction.type} onClick={handleCoinToggle}>
            <SwitchableDisplay coin={coin} size='16px' weight={300} color='white' cursor='pointer'>{transaction.amount}</SwitchableDisplay>
          </ToggleButton>
          <TransactionValues>
            { coin === 'BTC' && <FiatAtTime amount={transaction.amount} hash={transaction.hash} time={transaction.time} type={transaction.type} /> }
            { transaction.type !== 'received' &&
              <FeeWrapper>
                <Text size='12px' weight={300}>
                  <FormattedMessage id='scenes.transactions.bitcoin.content.pages.listitem.fee.label' defaultMessage='Transaction Fee: ' />
                </Text>
                <SwitchableDisplay coin={coin} size='12px' weight={200}>{transaction.fee}</SwitchableDisplay>
              </FeeWrapper>
            }
          </TransactionValues>
        </AmountColumn>
      </TransactionRow>
    </TransactionRowContainer>
  )
}

TransactionListItem.propTypes = {
  coin: PropTypes.string.isRequired,
  minConfirmations: PropTypes.number.isRequired,
  handleCoinToggle: PropTypes.func.isRequired,
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
