import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { Button } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import { RootState } from 'data/rootReducer'
import { SBOrderType } from 'core/types'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import media from 'services/ResponsiveService'

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
  padding: 16px 16px 0;
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
  padding-bottom: 16px;
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
// const amount = Currency.fiatToString({
//   unit: Currencies[props.order.inputCurrency].units[props.order.inputCurrency],
//   value: convertBaseToStandard('FIAT', props.order.inputQuantity)
// })

class SimpleBuyListItem extends PureComponent<Props> {
  render () {
    const { orders } = this.props
    // showModal = () => {
    //   const latestPendingOrder = this.props.orders.find(order => {
    //     return (
    //       order.state === 'PENDING_CONFIRMATION' ||
    //       order.state === 'PENDING_DEPOSIT'
    //     )
    //   })

    //   if (!latestPendingOrder) return
    //   this.props.modalActions.showModal('SIMPLE_BUY_MODAL')
    //   this.props.simpleBuyActions.setStep({
    //     step: 'ORDER_SUMMARY',
    //     order: latestPendingOrder
    //   })
    // }
    return (
      <TransactionRowContainer data-e2e='orderRow'>
        {orders.map(order => {
          return (
            <TransactionRow>
              <StatusColumn data-e2e='orderStatusColumn'>
                {order.state}
              </StatusColumn>
              <AmountColumn data-e2e='orderAmountColumn'>
                {order.inputQuantity}
              </AmountColumn>
              <ViewInfoColumn>
                <Button
                  data-e2e='viewInfoButton'
                  size='14px'
                  height='40px'
                  nature='light'
                  // onClick={() => this.showModal()}
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
