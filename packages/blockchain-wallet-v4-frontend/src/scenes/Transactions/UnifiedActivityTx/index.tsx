import React, { useState } from 'react'
import { connect } from 'react-redux'
import useTransactionDetails from 'blockchain-wallet-v4-frontend/src/hooks/useTransactionDetails'

import { ActivityResponseType } from '@core/network/api/coins/types'
import { Text } from 'blockchain-info-components'
import { StandardRow } from 'components/Rows'
import { selectors } from 'data'

import {
  Col,
  DetailsColumn,
  DetailsRow,
  Row,
  RowHeader,
  RowValue,
  StatusAndType,
  TxRow,
  TxRowContainer
} from '../components'

const Loading = () => {
  return (
    <>
      <StandardRow loading />
    </>
  )
}

const UnifiedActivityTx: React.FC<Props> = ({ guid, sharedKey, tx }) => {
  const [isToggled, setIsToggled] = useState(false)

  const { fetchTxDetails, loading, txDetails } = useTransactionDetails({
    guid,
    sharedKey,
    txId: tx.id
  })

  const handleOnClick = () => {
    if (!isToggled) {
      fetchTxDetails()
    } else {
      setIsToggled((isToggled) => !isToggled)
    }
  }

  return (
    <TxRowContainer className={isToggled ? 'active' : ''} onClick={handleOnClick}>
      <TxRow>
        <Col width='5%'>
          <img src={tx.item.leadingImage.main} alt='Transaction type icon' />
        </Col>
        <Row width='30%'>
          <StatusAndType data-e2e='txStatusColumn'>
            {tx.item.leading.map((item, index) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText' key={index}>
                  {item.value}
                </Text>
              )
            })}
          </StatusAndType>
        </Row>
        <Col width='50%' />
        <Col width='20%' style={{ textAlign: 'right' }} data-e2e='orderAmountColumn'>
          {tx.item.trailing.map((item, index) => {
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText' key={index}>
                {item.value}
              </Text>
            )
          })}
        </Col>
      </TxRow>

      {loading && <Loading />}

      {isToggled && !loading && (
        <>
          <DetailsRow>
            {txDetails[0].map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <DetailsColumn key={index}>
                {item?.leading && <RowHeader>{item.leading[0].value}</RowHeader>}
                {item?.trailing && <RowValue>{item.trailing[0].value}</RowValue>}
              </DetailsColumn>
            ))}
          </DetailsRow>
          <DetailsRow>
            {txDetails[1].map((item, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <DetailsColumn key={index}>
                {item?.leading && <RowHeader>{item.leading[0].value}</RowHeader>}
                {item?.trailing && <RowValue>{item.trailing[0].value}</RowValue>}
              </DetailsColumn>
            ))}
          </DetailsRow>
        </>
      )}
    </TxRowContainer>
  )
}

type Props = {
  coin: string
  guid: string
  sharedKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: ActivityResponseType['activity'][0] | any
}

const mapStateToProps = (state) => ({
  guid: selectors.core.wallet.getGuid(state) as string,
  sharedKey: selectors.core.wallet.getSharedKey(state) as string
})

const connector = connect(mapStateToProps)

export default connector(UnifiedActivityTx)
