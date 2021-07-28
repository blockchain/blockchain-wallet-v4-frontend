import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { BuyOrSell, displayFiat } from 'blockchain-wallet-v4-frontend/src/modals/SimpleBuy/model'
import { path } from 'ramda'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import {
  ExtractSuccess,
  FiatType,
  RemoteDataType,
  SBOrderType
} from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import {
  getBaseAmount,
  getBaseCurrency,
  getCoinFromPair,
  getCounterAmount,
  getCounterCurrency,
  getOrderType
} from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

import {
  Addresses,
  Col,
  DetailsColumn,
  DetailsRow,
  Row,
  RowHeader,
  RowValue,
  StatusAndType,
  StyledBuyFiatDisplay,
  StyledCoinDisplay,
  StyledFiatDisplay,
  TxRow,
  TxRowContainer
} from '../components'
import { getOrigin, IconTx, Status, Timestamp } from './model'
import { getData } from './selectors'

const LastCol = styled(Col)`
  display: flex;
  justify-content: flex-end;
`
class SimpleBuyListItem extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { isToggled: false }
  }

  handleToggle = () => {
    this.setState((prevState) => ({ isToggled: !prevState.isToggled }))
  }

  showModal = (order: SBOrderType) => {
    this.props.modalActions.showModal('SIMPLE_BUY_MODAL', {
      origin: 'TransactionList'
    })
    this.props.simpleBuyActions.setStep({
      order,
      step:
        order.state === 'PENDING_CONFIRMATION'
          ? 'CHECKOUT_CONFIRM'
          : order.attributes?.authorisationUrl
          ? 'OPEN_BANKING_CONNECT'
          : 'ORDER_SUMMARY'
    })
    if (order.attributes?.authorisationUrl) {
      this.props.simpleBuyActions.confirmOrderPoll(order)
    }
  }

  render() {
    const { data, order } = this.props
    const bankAccounts = data.getOrElse([]) as Array<BankTransferAccountType>
    const coin = getCoinFromPair(order.pair)
    const coinDisplayName = coin
    const orderType = getOrderType(order)
    const baseAmount = getBaseAmount(order)
    const baseCurrency = getBaseCurrency(order)
    const counterAmount = getCounterAmount(order)
    const counterCurrency = getCounterCurrency(order)
    const totalTxAmount = fiatToString({
      unit: counterCurrency as FiatType,
      value: counterAmount
    })

    return (
      <TxRowContainer className={this.state.isToggled ? 'active' : ''} data-e2e='transactionRow'>
        <TxRow onClick={this.handleToggle}>
          <Row width='30%' data-e2e='orderStatusColumn'>
            <IconTx {...this.props} />
            <StatusAndType>
              <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText'>
                <BuyOrSell crypto={coin} orderType={orderType} />
              </Text>
              <Timestamp {...this.props} />
            </StatusAndType>
          </Row>
          <Col width='50%' data-e2e='orderToAndFrom'>
            <Addresses
              from={<>{getOrigin(this.props, bankAccounts)}</>}
              to={<>{coinDisplayName} Trading Account</>}
            />
          </Col>
          {order.state === 'PENDING_CONFIRMATION' || order.state === 'PENDING_DEPOSIT' ? (
            <LastCol
              width='20%'
              style={{ alignItems: 'flex-end', textAlign: 'right' }}
              data-e2e='orderAmountColumn'
            >
              <Button
                data-e2e='viewInfoButton'
                size='14px'
                height='35px'
                nature='light'
                // @ts-ignore
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  return this.showModal(order)
                }}
              >
                <FormattedMessage
                  id='modals.simplebuy.transactionlist.viewdetails'
                  defaultMessage='View Details'
                />
              </Button>
            </LastCol>
          ) : (
            <Col width='20%' data-e2e='orderAmountColumn'>
              <StyledCoinDisplay coin={coin} data-e2e='orderCoinAmt'>
                {orderType === 'BUY' ? order.outputQuantity : order.inputQuantity}
              </StyledCoinDisplay>
              {orderType === 'BUY' ? (
                <StyledBuyFiatDisplay>
                  <Text color='grey600' data-e2e='orderFiatAmt' size='14px' weight={500}>
                    {totalTxAmount}
                  </Text>
                </StyledBuyFiatDisplay>
              ) : (
                <StyledFiatDisplay
                  size='14px'
                  weight={500}
                  color='grey600'
                  coin={coin}
                  data-e2e='orderFiatAmt'
                >
                  {order.inputQuantity}
                </StyledFiatDisplay>
              )}
            </Col>
          )}
        </TxRow>
        {this.state.isToggled && (
          <DetailsRow>
            <DetailsColumn>
              <RowHeader>
                <FormattedMessage
                  defaultMessage='Transaction ID'
                  id='modals.simplebuy.summary.txid'
                />
              </RowHeader>
              <RowValue>{order.id}</RowValue>
              <RowHeader>
                <FormattedMessage
                  id='modals.simplebuy.summary.rate'
                  defaultMessage='Exchange Rate'
                />
              </RowHeader>
              <RowValue data-e2e='sbRate'>
                {fiatToString({
                  unit: counterCurrency as FiatType,
                  value: convertBaseToStandard('FIAT', order.price)
                })}{' '}
                / {baseCurrency}
              </RowValue>
              {order.fee !== '0' && (
                <>
                  <RowHeader>
                    <FormattedMessage id='copy.fee' defaultMessage='Fee' />
                  </RowHeader>
                  <RowValue data-e2e='sbFee'>{displayFiat(order, order.fee || '0')}</RowValue>
                </>
              )}
            </DetailsColumn>
            <DetailsColumn />
            <DetailsColumn>
              <RowHeader>
                <FormattedMessage defaultMessage='Status' id='components.txlistitem.status' />
              </RowHeader>
              <RowValue>
                <Status {...this.props} />
              </RowValue>
              <RowHeader>
                <FormattedMessage id='copy.amount' defaultMessage='Amount' />
              </RowHeader>
              <RowValue data-e2e='sbPurchasing'>
                {baseAmount} of {baseCurrency}
              </RowValue>
              <RowHeader>
                <FormattedMessage id='copy.total' defaultMessage='Total' />
              </RowHeader>
              <RowValue data-e2e='sbSentTotal'>{totalTxAmount}</RowValue>
            </DetailsColumn>
          </DetailsRow>
        )}
      </TxRowContainer>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  order: SBOrderType
}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
export type Props = OwnProps & ConnectedProps<typeof connector>
type State = { isToggled: boolean }

export default connector(SimpleBuyListItem)
