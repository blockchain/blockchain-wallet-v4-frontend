import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { SBOrderType } from 'core/types'
import { Text } from 'blockchain-info-components'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import {
  Addresses,
  Col,
  Row,
  StatusAndType,
  StyledCoinDisplay,
  StyledFiatDisplay,
  Timestamp,
  TxRow
} from '../components'
import { BuyOrSell } from 'blockchain-wallet-v4-frontend/src/modals/SimpleBuy/model'
import { getCoinFromPair, getOrderType } from 'data/components/simpleBuy/model'
import { getOrigin, IconTx } from './model'

class SimpleBuyListItem extends PureComponent<Props> {
  showModal = (order: SBOrderType) => {
    this.props.modalActions.showModal('SIMPLE_BUY_MODAL', {
      origin: 'TransactionList'
    })
    this.props.simpleBuyActions.setStep({
      step:
        order.state === 'PENDING_CONFIRMATION'
          ? 'CHECKOUT_CONFIRM'
          : 'ORDER_SUMMARY',
      order
    })
  }

  render () {
    const { order } = this.props
    const coin = getCoinFromPair(order.pair)
    const orderType = getOrderType(order)

    return (
      <TxRow onClick={() => this.showModal(order)}>
        <Row width='30%' data-e2e='orderStatusColumn'>
          <IconTx {...this.props} />
          <StatusAndType>
            <Text
              size='16px'
              color='grey800'
              weight={600}
              data-e2e='txTypeText'
            >
              <BuyOrSell crypto={coin} orderType={orderType} />
            </Text>
            <Timestamp time={order.insertedAt} />
          </StatusAndType>
        </Row>
        <Col width='50%' data-e2e='orderToAndFrom'>
          <Addresses
            from={<>{getOrigin(this.props)}</>}
            to={<>{this.props.order.outputCurrency} Trading Wallet</>}
          />
        </Col>
        <Col
          width='20%'
          style={{ textAlign: 'right' }}
          data-e2e='orderAmountColumn'
        >
          <StyledCoinDisplay coin={coin} data-e2e='orderCoinAmt'>
            {orderType === 'BUY' ? order.outputQuantity : order.inputQuantity}
          </StyledCoinDisplay>
          <StyledFiatDisplay
            size='14px'
            weight={500}
            color='grey600'
            coin={coin}
            data-e2e='orderFiatAmt'
          >
            {orderType === 'BUY' ? order.outputQuantity : order.inputQuantity}
          </StyledFiatDisplay>
        </Col>
      </TxRow>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

type OwnProps = {
  order: SBOrderType
}

export type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(SimpleBuyListItem)
