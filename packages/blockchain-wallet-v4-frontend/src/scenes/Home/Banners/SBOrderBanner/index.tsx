import React, { PureComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { BuyOrSell } from 'blockchain-wallet-v4-frontend/src/modals/SimpleBuy/model'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import {
  SBOrderType,
  SupportedWalletCurrenciesType,
  WalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { getOrderType } from 'data/components/simpleBuy/model'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;

  ${media.atLeastLaptop`
    height: 80px;
    padding: 0 20px;
  `}
  ${media.mobile`
    padding: 12px;
    flex-direction: column;
  `}
`
const Row = styled.div`
  display: flex;
  align-items: center;
`
const Column = styled.div`
  display: flex;
  flex-direction: column;

  & > div:first-child {
    margin-bottom: 4px;
  }
`
const PendingIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-right: 20px;
  background-color: ${props => props.theme.orange000};
`
const Copy = styled(Text)`
  display: flex;
  align-items: center;
  ${media.mobile`
    font-size: 12px;
  `}
  ${media.tablet`
    font-size: 14px;
  `}
`
const BannerButton = styled(Button)`
  height: 48px;
  ${media.mobile`
    font-size: 14px;
    margin-top: 16px;
    padding: 10px;
  `}
`

class SBOrderBanner extends PureComponent<Props> {
  showModal = () => {
    this.props.simpleBuyActions.showModal('PendingOrder')
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
              <BuyOrSell
                orderType={orderType}
                coinModel={
                  this.props.supportedCoins[
                    latestPendingOrder.outputCurrency as WalletCurrencyType
                  ]
                }
              />
            </Text>
            <Copy size='16px' color='grey600' weight={500}>
              {latestPendingOrder.paymentType === 'PAYMENT_CARD' ? (
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
          data-e2e='openPendingSBOrder'
          nature='primary'
        >
          <FormattedMessage
            id='scenes.home.banner.sborder.details'
            defaultMessage='View Details'
          />
        </BannerButton>
      </Wrapper>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  latestPendingOrder: selectors.components.simpleBuy.getSBLatestPendingOrder(
    state
  ),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  latestPendingOrder?: SBOrderType
  supportedCoins: SupportedWalletCurrenciesType
}
type Props = ConnectedProps<typeof connector>

export default connector(SBOrderBanner)
