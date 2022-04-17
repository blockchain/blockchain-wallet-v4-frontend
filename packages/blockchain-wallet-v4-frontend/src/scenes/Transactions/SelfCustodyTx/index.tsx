import React from 'react'

import { SelfCustodyTxType } from '@core/network/api/coin/types'
import { Text } from 'blockchain-info-components'

import {
  Addresses,
  Col,
  IconTx,
  Row,
  StatusAndType,
  StyledCoinDisplay,
  StyledFiatDisplay,
  Timestamp,
  TxRow,
  TxRowContainer
} from '../components'
import { TransactionType } from './SelfCustodyTxModel'

const SelfCustodyTx: React.FC<Props> = ({ tx }) => {
  const movement = tx.movements[0]

  // TODO: SELF_CUSTODY
  const coin = 'STX'

  return (
    // TODO: SELF_CUSTODY
    <TxRowContainer
      onClick={() => window.open(`https://explorer.stacks.co/txid/${tx.txId}`, '_blank')}
    >
      <TxRow>
        <Row width='30%'>
          <IconTx
            type={movement.type}
            coin={movement.type === 'RECEIVED' ? 'green400' : 'red500'}
          />
          <StatusAndType data-e2e='txStatusColumn'>
            <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText'>
              <TransactionType txType={movement.type} /> {coin}
            </Text>
            <Timestamp time={tx.timestamp * 1000} />
          </StatusAndType>
        </Row>
        <Col width='50%'>
          <Addresses
            from={
              movement.type === 'RECEIVED' ? (
                <>{movement.address}</>
              ) : (
                <>{coin} Private Key Wallet</>
              )
            }
            to={movement.type === 'SENT' ? <>{movement.address}</> : <>{coin} Private Key Wallet</>}
          />
        </Col>
        <Col width='20%' style={{ textAlign: 'right' }} data-e2e='orderAmountColumn'>
          <StyledCoinDisplay coin={coin} data-e2e='orderCoinAmt'>
            {movement.amount}
          </StyledCoinDisplay>
          <StyledFiatDisplay
            size='14px'
            weight={500}
            coin={coin}
            color='grey600'
            data-e2e='orderFiatAmt'
          >
            {movement.amount}
          </StyledFiatDisplay>
        </Col>
      </TxRow>
    </TxRowContainer>
  )
}

type Props = { tx: SelfCustodyTxType }

export default SelfCustodyTx
