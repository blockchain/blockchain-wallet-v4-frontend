import React, { useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from '@reduxjs/toolkit'

import { ActivityResponseType } from '@core/network/api/coins/types'
import { Text } from 'blockchain-info-components'
// import { getData } from './selectors'
import { actions } from 'data'

import { Col, Row, StatusAndType, TxRow, TxRowContainer } from '../components'

const UnifiedActivityTx: React.FC<Props> = ({ fetchTransactionDetails, tx }) => {
  const [isToggled, setIsToggled] = useState(false)

  // const groupedItems = [
  //   ...response.itemGroups[0].itemGroup,
  //   ...response.itemGroups[1].itemGroup
  // ]

  const handlePress = () => {
    if (tx.id) {
      fetchTransactionDetails(tx.id)
      setIsToggled(!isToggled)
    }
  }

  return (
    <TxRowContainer className={isToggled ? 'active' : ''} onClick={handlePress}>
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

      {isToggled && (
        <>
          {/* <DetailsRow>
          {groupedItems.map((item, index) => {
            if (index === 0) return
            return (
              <DetailsColumn>
                <RowHeader>
                  {item.leading !== undefined ? item.leading[0].value : null}
                </RowHeader>
                <RowValue>
                  {item.trailing !== undefined ? item.trailing[0].value : null}
                </RowValue>
              </DetailsColumn>
            )
          })
          }
        </DetailsRow> */}
        </>
      )}
    </TxRowContainer>
  )
}

type Props = {
  coin: string
  fetchTransactionDetails: (id: string) => void
  tx: ActivityResponseType['activity'][0] | any
}

const mapStateToProps = () => ({
  // data: getData(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchTransactionDetails: bindActionCreators(
    actions.middleware.webSocket.activities.getTransactionDetails,
    dispatch
  )
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(UnifiedActivityTx)
