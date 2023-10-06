import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { BuyOrSell } from 'blockchain-wallet-v4-frontend/src/modals/BuySell/model'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { BSOrderType, BSPaymentTypes } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { getOrderType } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'

import { BannerButton, Column, Copy, PendingIconWrapper, Wrapper } from '../styles'

const Row = styled.div`
  display: flex;
  align-items: center;
`

class BSOrderBanner extends PureComponent<Props> {
  showModal = () => {
    this.props.buySellActions.showModal({ origin: 'PendingOrder' })
  }

  render() {
    const { latestPendingOrder } = this.props

    if (!latestPendingOrder) return null

    const orderType = getOrderType(latestPendingOrder)

    return (
      <Wrapper>
        <Row>
          <PendingIconWrapper>
            <Icon name='pending' color='orange600' size='20px' />
          </PendingIconWrapper>
          <Column>
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage id='copy.pending' defaultMessage='Pending' />{' '}
              <BuyOrSell orderType={orderType} />
            </Text>
            <Copy size='16px' color='grey600' weight={500}>
              {latestPendingOrder.paymentType === BSPaymentTypes.PAYMENT_CARD ? (
                <FormattedMessage
                  id='scenes.home.banner.receive_cc_order'
                  defaultMessage='Once you finalize your credit card information, your buy order will complete.'
                />
              ) : orderType === 'BUY' ? (
                <FormattedMessage
                  id='scenes.home.banner.finalize_funds'
                  defaultMessage='Once we receive your funds, your buy order will complete.'
                />
              ) : (
                <FormattedMessage
                  id='scenes.home.banner.finalize_sell'
                  defaultMessage='Confirm the transaction details to finalize your sell order.'
                />
              )}
            </Copy>
          </Column>
        </Row>
        <BannerButton
          onClick={() => this.showModal()}
          jumbo
          data-e2e='openPendingBSOrder'
          nature='primary'
        >
          <FormattedMessage id='scenes.home.banner.sborder.details' defaultMessage='View Details' />
        </BannerButton>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  latestPendingOrder: selectors.components.buySell.getBSLatestPendingOrder(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  buySellActions: bindActionCreators(actions.components.buySell, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  latestPendingOrder?: BSOrderType
}
type Props = ConnectedProps<typeof connector>

export default connector(BSOrderBanner)
