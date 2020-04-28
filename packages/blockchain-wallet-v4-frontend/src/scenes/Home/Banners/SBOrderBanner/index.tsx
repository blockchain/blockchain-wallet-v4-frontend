import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { Button, Icon, Text } from 'blockchain-info-components'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { RootState } from 'data/rootReducer'
import { SBOrderType } from 'core/types'
import media from 'services/ResponsiveService'
import React, { PureComponent } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${props => props.theme.grey000};
  border-radius: 8px;
  padding: 20px;

  @media (min-width: 1200px) {
    height: 80px;
    padding: 0 20px;
  }
  ${media.mobile`
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
    margin-top: 8px;
    padding: 10px;
  `}
`

class SBOrderBanner extends PureComponent<Props> {
  showModal = () => {
    const latestPendingOrder = this.props.orders.find(order => {
      return (
        order.state === 'PENDING_CONFIRMATION' ||
        order.state === 'PENDING_DEPOSIT'
      )
    })

    if (!latestPendingOrder) return
    this.props.simpleBuyActions.showModal('pendingOrder')
    this.props.simpleBuyActions.setStep({
      step:
        latestPendingOrder.state === 'PENDING_CONFIRMATION'
          ? 'CHECKOUT_CONFIRM'
          : 'ORDER_SUMMARY',
      order: latestPendingOrder
    })
  }

  render () {
    return (
      <Wrapper>
        <Row>
          <PendingIconWrapper>
            <Icon name='pending' color='orange600' size='20px' />
          </PendingIconWrapper>
          <Column>
            <Text size='20px' weight={600} color='grey800'>
              <FormattedMessage
                id='scenes.home.banner.pendingbuy'
                defaultMessage='Pending Buy'
              />
            </Text>
            <Copy size='16px' color='grey600' weight={500}>
              <FormattedMessage
                id='scenes.home.banner.receivetransfer'
                defaultMessage='Once we receive your bank transfer, your buy order will complete.'
              />
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
  orders: selectors.components.simpleBuy.getSBOrders(state).getOrElse([])
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type LinkStatePropsType = {
  orders: Array<SBOrderType>
}
type Props = ConnectedProps<typeof connector>

export default connector(SBOrderBanner)
