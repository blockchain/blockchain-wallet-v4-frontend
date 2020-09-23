import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { SBOrderType } from 'core/types'
import { Text } from 'blockchain-info-components'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { BuyOrSell } from 'blockchain-wallet-v4-frontend/src/modals/SimpleBuy/model'
import {
  Col,
  CustodialTransactionRow,
  Row,
  StatusAndType,
  StyledCoinDisplay,
  StyledFiatDisplay,
  Timestamp
} from '../components'
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
      <CustodialTransactionRow onClick={() => this.showModal(order)}>
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
          <Text size='16px' weight={600} color='grey800' data-e2e='txFrom'>
            <FormattedMessage
              id='modals.simplebuy.confirm.payment'
              defaultMessage='Payment Method'
            />
            {': '}
            {getOrigin(this.props)}
          </Text>
          <Text
            size='14px'
            weight={500}
            color='grey600'
            style={{ marginTop: '4px' }}
            data-e2e='txTo'
          >
            <FormattedMessage id='copy.to' defaultMessage='To' />
            {': '}
            {this.props.order.outputCurrency} Trading Wallet
          </Text>
        </Col>
        <Col
          width='20%'
          style={{ textAlign: 'right' }}
          data-e2e='orderAmountColumn'
        >
          <StyledCoinDisplay
            coin={coin}
            size='16px'
            weight={600}
            color='grey800'
            data-e2e='orderFiatAmt'
          >
            {orderType === 'BUY' ? order.outputQuantity : order.inputQuantity}
          </StyledCoinDisplay>
          <StyledFiatDisplay
            coin={coin}
            size='14px'
            weight={500}
            color='grey600'
            style={{ marginTop: '4px', alignSelf: 'flex-end' }}
          >
            {orderType === 'BUY' ? order.outputQuantity : order.inputQuantity}
          </StyledFiatDisplay>
        </Col>
      </CustodialTransactionRow>
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
