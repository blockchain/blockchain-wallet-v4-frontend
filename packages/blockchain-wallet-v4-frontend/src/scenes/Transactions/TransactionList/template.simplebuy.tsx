import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { Button, Text } from 'blockchain-info-components'
import { CoinType, SBOrderType } from 'core/types'
import { connect } from 'react-redux'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { FormattedMessage } from 'react-intl'
import { getOrderType } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { Status } from './model'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import media from 'services/ResponsiveService'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

type LinkDispatchPropsType = {
  modalActions: typeof actions.modals
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  orders: Array<SBOrderType>
}
type Props = LinkDispatchPropsType & LinkStatePropsType

const TransactionRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-shadow: none;
  padding: 14px 14px 0;
  box-sizing: border-box;
  transition: box-shadow 0.3s;
  &.active {
    box-shadow: 0 5px 30px 0 rgba(0, 0, 0, 0.1);
  }
`
const TransactionRow = styled.div`
  width: 100%;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 14px;
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const StatusColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 30%;
  ${media.mobile`
    width: 50%;
  `};
`
const AmountColumn = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  white-space: nowrap;
  width: 50%;
  @media (min-width: 992px) {
    display: flex;
  }
`
const ViewInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 20%;
  align-items: flex-end;
  ${media.mobile`
    min-width: 50%;
  `};
`

class SimpleBuyListItem extends PureComponent<Props> {
  showModal = (order: SBOrderType) => {
    this.props.modalActions.showModal('SIMPLE_BUY_MODAL')
    this.props.simpleBuyActions.setStep({
      step:
        order.state === 'PENDING_CONFIRMATION'
          ? 'CHECKOUT_CONFIRM'
          : 'ORDER_SUMMARY',
      order: order
    })
  }

  render () {
    const { orders } = this.props

    return (
      <TransactionRowContainer data-e2e='orderRow'>
        {orders.map(order => {
          const inputAmt =
            getOrderType(order) === 'BUY'
              ? Currency.fiatToString({
                  unit:
                    Currencies[order.inputCurrency].units[order.inputCurrency],
                  value: convertBaseToStandard('FIAT', order.inputQuantity)
                })
              : 'Not yet implemented'

          return (
            <TransactionRow>
              <StatusColumn data-e2e='orderStatusColumn'>
                <Status order={order} />
              </StatusColumn>
              <AmountColumn data-e2e='orderAmountColumn'>
                <Text size='14px' weight={500}>
                  {inputAmt}
                </Text>
              </AmountColumn>
              <ViewInfoColumn>
                <Button
                  data-e2e='viewInfoButton'
                  size='14px'
                  height='35px'
                  nature='light'
                  onClick={() => this.showModal(order)}
                >
                  <FormattedMessage
                    id='modals.simplebuy.transactionlist.viewdetails'
                    defaultMessage='View Details'
                  />
                </Button>
              </ViewInfoColumn>
            </TransactionRow>
          )
        })}
      </TransactionRowContainer>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  orders: selectors.components.simpleBuy.getSBOrders(state).getOrElse([])
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SimpleBuyListItem)
