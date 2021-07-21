import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Link, Text } from 'blockchain-info-components'
import { coinToString, fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import { CoinType, ProcessedSwapOrderType, WalletOptionsType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { getInput, getOutput } from 'data/components/swap/model'
import { RootState } from 'data/rootReducer'

import {
  Addresses,
  Col,
  DetailsColumn,
  DetailsRow,
  Row,
  RowHeader,
  RowValue,
  StatusAndType,
  StyledCoinDisplay,
  StyledFiatDisplay,
  TxRow,
  TxRowContainer
} from '../components'
import { getDestination, getOrigin, IconTx, Status, Timestamp } from './model'

const LastCol = styled(Col)`
  display: flex;
  justify-content: flex-end;
`
const ViewTxWrapper = styled.div`
  display: flex;
  justify-items: center;
  margin-top: 10px;
  & > :last-child {
    display: inline;
    margin-left: 5px;
  }
`
class SwapOrderTx extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { isToggled: false }
  }

  handleToggle = () => {
    this.setState((prevState) => ({ isToggled: !prevState.isToggled }))
  }

  showModal = (order: ProcessedSwapOrderType) => {
    this.props.modalActions.showModal('SWAP_MODAL', {
      origin: 'TransactionList'
    })
    this.props.swapActions.setStep({
      options: {
        order
      },
      step: 'ORDER_DETAILS'
    })
  }

  render() {
    const { coin, domains, order } = this.props
    const base = getInput(order)
    const counter = getOutput(order)
    const { outputMoney } = this.props.order.priceFunnel
    return (
      <TxRowContainer className={this.state.isToggled ? 'active' : ''} data-e2e='transactionRow'>
        <TxRow onClick={this.handleToggle}>
          <Row width='30%' data-e2e='orderStatusColumn'>
            <IconTx {...this.props} />
            <StatusAndType>
              <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText'>
                Swap {this.props.order.pair}
              </Text>
              <Timestamp {...this.props} />
            </StatusAndType>
          </Row>
          <Col width='50%' data-e2e='orderToAndFrom'>
            <Addresses from={<>{getOrigin(this.props)}</>} to={<>{getDestination(this.props)}</>} />
          </Col>
          {order.state === 'PENDING_DEPOSIT' ? (
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
                {outputMoney}
              </StyledCoinDisplay>
              <StyledFiatDisplay
                size='14px'
                weight={500}
                color='grey600'
                coin={coin}
                data-e2e='orderFiatAmt'
              >
                {outputMoney}
              </StyledFiatDisplay>
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
              <RowValue data-e2e='swapRate'>
                1 {base} ={' '}
                {coinToString({
                  unit: { symbol: counter },
                  value: order.priceFunnel.price
                })}
              </RowValue>
              {order.kind.depositTxHash && (
                <ViewTxWrapper>
                  <Text size='14px' weight={500} color='grey600'>
                    <FormattedMessage
                      id='copy.view_outgoing_tx'
                      defaultMessage='View Outgoing Transaction'
                    />
                  </Text>
                  <Link
                    href={`${domains.comRoot}/search/?search=/${order.kind.depositTxHash}`}
                    target='_blank'
                    data-e2e='swapOutgoingTransactionListItemExplorerLink'
                  >
                    <Icon name='open-in-new-tab' color='marketing-primary' cursor size='14px' />
                  </Link>
                </ViewTxWrapper>
              )}
              {order.kind.withdrawalTxHash && (
                <ViewTxWrapper>
                  <Text size='14px' weight={500} color='grey600'>
                    <FormattedMessage
                      id='copy.view_incoming_tx'
                      defaultMessage='View Incoming Transaction'
                    />
                  </Text>
                  <Link
                    href={`${domains.comRoot}/search/?search=/${order.kind.depositTxHash}`}
                    target='_blank'
                    data-e2e='swapIncomingTransactionListItemExplorerLink'
                  >
                    <Icon name='open-in-new-tab' color='marketing-primary' cursor size='14px' />
                  </Link>
                </ViewTxWrapper>
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
                <FormattedMessage id='copy.amount_sent' defaultMessage='Amount Sent' />
              </RowHeader>
              <RowValue data-e2e='swapPurchasing'>
                {fiatToString({
                  unit: this.props.order.fiatCurrency,
                  value: convertBaseToStandard('FIAT', this.props.order.fiatValue)
                })}
              </RowValue>
            </DetailsColumn>
          </DetailsRow>
        )}
      </TxRowContainer>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const mapStateToProps = (state: RootState) => ({
  domains: selectors.core.walletOptions.getDomains(state).getOrElse({
    comRoot: 'https://www.blockchain.com'
  } as WalletOptionsType['domains'])
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  coin: CoinType
  order: ProcessedSwapOrderType
}
export type Props = OwnProps & ConnectedProps<typeof connector>
type State = { isToggled: boolean }

export default connector(SwapOrderTx)
