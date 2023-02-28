import React, { useState } from 'react'

import { ActivityResponseType } from '@core/network/api/coins/types'
import { Text } from 'blockchain-info-components'

import { Addresses, Col, Row, StatusAndType, Timestamp, TxRow, TxRowContainer } from '../components'

const UnifiedActivityTx: React.FC<Props> = ({ coin, tx }) => {
  const [isToggled, setIsToggled] = useState(false)

  return (
    <TxRowContainer
      className={isToggled ? 'active' : ''}
      onClick={() => window.open(`${tx.externalUrl}`, '_blank')}
    >
      <TxRow>
        <Row width='30%'>
          {/* <img alt='tx-type' src={tx.item.iconUrl} /> */}
          <StatusAndType data-e2e='txStatusColumn'>
            <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText'>
              {tx.item.startTitle}
            </Text>
            <Timestamp time={tx.timestamp * 1000} />
          </StatusAndType>
        </Row>
        <Col width='50%'>
          {tx.detail.itemGroups.find(({ itemGroup }) =>
            itemGroup.find(({ key }) => key === 'From')
          ) ? (
            <Addresses
              from={tx.detail.itemGroups.map(({ itemGroup }) => {
                return itemGroup
                  .filter(({ key }) => key === 'From')
                  .map((from) => {
                    return <>{from.value}</>
                  })
              })}
              to={tx.detail.itemGroups.map(({ itemGroup }) => {
                return itemGroup
                  .filter(({ key }) => key === 'To')
                  .map((to) => {
                    return <>{to.value}</>
                  })
              })}
            />
          ) : null}
        </Col>
        {/* <Col /> */}
        <Col width='20%' style={{ textAlign: 'right' }} data-e2e='orderAmountColumn'>
          <Text
            color='grey800'
            style={{ display: 'flex', justifyContent: 'flex-end' }}
            size='16px'
            weight={600}
          >
            {tx.item.endTitle ||
              tx.detail.itemGroups.find(
                ({ itemGroup }) => itemGroup.find(({ key }) => key === 'Network fee')?.key
              )}
          </Text>
          <Text size='14px' weight={500} color='grey600' data-e2e='orderFiatAmt'>
            {tx.item.endSubtitle ||
              tx.detail.itemGroups.find(
                ({ itemGroup }) => itemGroup.find(({ key }) => key === 'Network fee')?.value
              )}
          </Text>
        </Col>
      </TxRow>
    </TxRowContainer>
  )
}

type Props = {
  coin: string
  tx: ActivityResponseType['activity'][0]
}

export default UnifiedActivityTx
