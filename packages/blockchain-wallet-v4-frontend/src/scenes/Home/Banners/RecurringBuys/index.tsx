import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import styled from 'styled-components'

import { BSOrderType } from '@core/types'
import { Icon, Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { RecurringBuyOrigins } from 'data/types'
import { media } from 'services/styles'

import { getRecurringBuyAnnouncement } from '../selectors'
import { BannerButton, CloseLink } from '../styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-image: url('/img/bg-banner-pattern-lg.svg');
  background-repeat: repeat-y;
  background-position: right;
  background-size: 35%;
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
  flex: 1;
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

const RecurringBuys = (props: Props) => {
  const showModal = () => {
    props.recurringBuyActions.showModal({ origin: RecurringBuyOrigins.RECURRING_BUYS_BANNER })
    props.recurringBuyActions.learnMoreLinkClicked(RecurringBuyOrigins.DASHBOARD_PROMO)
  }

  const completeAnnouncement = getRecurringBuyAnnouncement()

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
      <CloseLink
        data-e2e='newCoinCloseButton'
        onClick={() => props.cacheActions.announcementDismissed(completeAnnouncement)}
      >
        <Icon size='20px' color='grey400' name='close-circle' />
      </CloseLink>
    </Wrapper>
  )
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  latestPendingOrder: selectors.components.buySell.getBSLatestPendingOrder(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  cacheActions: bindActionCreators(actions.cache, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  recurringBuyActions: bindActionCreators(actions.components.recurringBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type LinkStatePropsType = {
  latestPendingOrder?: BSOrderType
}
type Props = ConnectedProps<typeof connector>

export default connector(RecurringBuys)
