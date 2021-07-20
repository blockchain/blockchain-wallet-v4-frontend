import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { SBOrderType } from 'blockchain-wallet-v4/src/types'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-image: url('/img/bg-banner-pattern-big.svg');
  background-repeat: repeat-y;
  background-position: right;
  align-items: center;
  border: 1px solid ${(props) => props.theme.grey000};
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
const SyncIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  min-width: 40px;
  border-radius: 20px;
  margin-right: 20px;
  background-color: ${(props) => props.theme.blue100};
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

const RecurringBuys = (props: Props) => {
  const showModal = () => {
    props.recurringBuysActions.showModal('RecurringBuys')
  }

  return (
    <Wrapper>
      <Row>
        <SyncIconWrapper>
          <Icon name='sync-regular' color='blue600' size='20px' />
        </SyncIconWrapper>
        <Column>
          <Text size='20px' weight={600} color='grey800'>
            <FormattedMessage
              id='scenes.home.banners.recurringbuys.title'
              defaultMessage='Recurring buys are now available'
            />{' '}
          </Text>
          <Copy size='16px' color='grey600' weight={500}>
            <FormattedMessage
              id='scenes.home.banners.recurringbuys.description'
              defaultMessage='It’s really hard to time the market, which is why many investors use dollar cost averaging.'
            />
          </Copy>
        </Column>
      </Row>
      <BannerButton
        onClick={() => showModal()}
        jumbo
        data-e2e='openRecurringBuyLearnMore'
        nature='empty-blue'
      >
        <FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />
      </BannerButton>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  latestPendingOrder: selectors.components.simpleBuy.getSBLatestPendingOrder(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  recurringBuysActions: bindActionCreators(actions.components.recurringBuys, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  latestPendingOrder?: SBOrderType
}
type Props = ConnectedProps<typeof connector>

export default connector(RecurringBuys)
