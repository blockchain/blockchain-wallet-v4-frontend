import React, { useState } from 'react'
import { connect } from 'react-redux'
import useTransactionDetails from 'blockchain-wallet-v4-frontend/src/hooks/useTransactionDetails'

import { ActivityResponseType } from '@core/network/api/coins/types'
import { Text } from 'blockchain-info-components'

// import { getData } from './selectors'
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

const UnifiedActivityTx: React.FC<Props> = ({ tx }) => {
  const [isToggled, setIsToggled] = useState(false)

  const { fetchTxDetails, loading, txDetails } = useTransactionDetails({
    guid: 'a94b409b488fd5efc03ea379ddcf96f90a89817f73252778623082234d1a7e54',
    sharedKey: '28d64de86040c047b072d7e94696de4a648378846e9e1ebd4453f92fcbfd7447',
    txId: '0xb6f578f86ff2286864ca4791c5ff5b6b34f4e57528848544bbf2031738a7590f'
  })

  const handleOnClick = () => {
    fetchTxDetails()
    setIsToggled(!isToggled)
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tx: ActivityResponseType['activity'][0] | any
}

const mapStateToProps = () => ({
  // data: getData(state),
})

const connector = connect(mapStateToProps)

export default connector(UnifiedActivityTx)
