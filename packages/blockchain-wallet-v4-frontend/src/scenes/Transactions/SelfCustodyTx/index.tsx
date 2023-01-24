import React from 'react'
import { FormattedMessage } from 'react-intl'

import { IngestedSelfCustodyType } from '@core/network/api/coin/types'
import { Text } from 'blockchain-info-components'
import { GreyCartridge } from 'components/Cartridge'

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
  // TODO: SELF_CUSTODY
  const coin = 'STX'

  return (
    // TODO: SELF_CUSTODY
    <TxRowContainer
      onClick={() => window.open(`https://explorer.stacks.co/txid/${tx.txId}`, '_blank')}
    >
      <TxRow>
        <Row width='30%'>
          <IconTx type={tx.type} coin={tx.type === 'RECEIVED' ? 'green400' : 'red500'} />
          <StatusAndType data-e2e='txStatusColumn'>
            <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText'>
              <TransactionType txType={tx.type} /> {coin}
            </Text>
            {tx.timestamp ? (
              <Timestamp time={tx.timestamp * 1000} />
            ) : (
              <GreyCartridge>
                <FormattedMessage id='copy.pending' defaultMessage='Pending' />
              </GreyCartridge>
            )}
          </StatusAndType>
        </Row>
        <Col width='50%'>
          <Addresses
            from={tx.type === 'SENT' ? <>{coin} DeFi Wallet</> : <>{tx.from}</>}
            to={tx.type === 'SENT' ? <>{tx.to}</> : <>{coin} DeFi Wallet</>}
          />
        </Col>
        <Col width='20%' style={{ textAlign: 'right' }} data-e2e='orderAmountColumn'>
          <StyledCoinDisplay coin={coin} data-e2e='orderCoinAmt'>
            {tx.amount}
          </StyledCoinDisplay>
          <StyledFiatDisplay
            size='14px'
            weight={500}
            coin={coin}
            color='grey600'
            data-e2e='orderFiatAmt'
          >
            {tx.amount}
          </StyledFiatDisplay>
        </Col>
      </TxRow>
    </TxRowContainer>
  )
}

type Props = { tx: IngestedSelfCustodyType }

export default SelfCustodyTx
