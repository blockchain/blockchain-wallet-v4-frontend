import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'
import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { Button, Text } from 'blockchain-info-components'
import { connect } from 'react-redux'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { FormattedMessage } from 'react-intl'
import { getOrderType } from 'data/components/simpleBuy/model'
import { SBOrderType } from 'core/types'
import { Status } from './model'
import Currencies from 'blockchain-wallet-v4/src/exchange/currencies'
import media from 'services/ResponsiveService'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

type OwnProps = {
  order: SBOrderType
}
type LinkDispatchPropsType = {
  modalActions: typeof actions.modals
  simpleBuyActions: typeof actions.components.simpleBuy
}
type Props = OwnProps & LinkDispatchPropsType

const TransactionRow = styled.div`
  width: 100%;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme.grey000} !important;
  box-sizing: border-box;
  padding: 14px;
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
      order
    })
  }

  render () {
    const { order } = this.props

    const inputAmt =
      getOrderType(order.pair) === 'BUY'
        ? Currency.fiatToString({
            unit: Currencies[order.inputCurrency].units[order.inputCurrency],
            value: convertBaseToStandard('FIAT', order.inputQuantity)
          })
        : 'Not yet implemented'

    return (
      <TransactionRow onClick={() => this.showModal(order)}>
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
          >
            <FormattedMessage
              id='modals.simplebuy.transactionlist.viewdetails'
              defaultMessage='View Details'
            />
          </Button>
        </ViewInfoColumn>
      </TransactionRow>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(
  undefined,
  mapDispatchToProps
)(SimpleBuyListItem)
