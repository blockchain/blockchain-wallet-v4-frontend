import React from 'react'
import { FormattedMessage } from 'react-intl'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { LinkContainer } from 'react-router-bootstrap'

import { actions } from 'data'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import { getData } from './selectors'
import { Icon, Link } from 'blockchain-info-components'
import { Row } from '../Layout'
import { ExchangeText } from 'components/Exchange'

const LimitText = styled(ExchangeText)`
  font-weight: 400;
`
const LimitRow = styled(Row)`
  padding-top: 0;
`
const Group = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`
const TierLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: cener;
`
const TierIcon = styled(Icon)`
  transform: rotate(270deg);
  margin-left: 8px;
  font-size: 14px;
  font-weight: 800;
`

const LimitMessage = ({
  currencySymbol,
  limit,
  showLimit,
  showPending,
  upgradeRequired
}) => {
  if (upgradeRequired)
    return (
      <LimitText color='btc'>
        &nbsp;
        <FormattedMessage
          id='scenes.exchange.exchangeform.limit_info.under_review'
          defaultMessage='In Review - Documents Needed'
        />
      </LimitText>
    )

  if (showLimit)
    return (
      <LimitText color='success'>
        &nbsp;
        <FormattedMessage
          id='scenes.exchange.exchangeform.limit_info.amount_available'
          defaultMessage='{amount} Available'
          values={{
            amount: fiatToString({
              value: limit,
              unit: { symbol: currencySymbol }
            })
          }}
        />
      </LimitText>
    )

  if (showPending)
    return (
      <LimitText color='btc'>
        &nbsp;
        <FormattedMessage
          id='scenes.exchange.exchangeform.limit_info.in_review'
          defaultMessage='In Review'
        />
      </LimitText>
    )

  return null
}

export const LimitAction = ({
  nextTier,
  nextTierAvailable,
  lastTierInReview,
  upgradeRequired,
  upgradeTier
}) => {
  if (upgradeRequired)
    return (
      <TierLink onClick={upgradeTier}>
        <LimitText color='brand-secondary'>
          <FormattedMessage
            id='scenes.exchange.exchangeform.limit_info.continue'
            defaultMessage='Continue'
          />
        </LimitText>
        <TierIcon name='down-arrow-filled' color='brand-secondary' />
      </TierLink>
    )

  if (nextTierAvailable)
    return (
      <TierLink onClick={upgradeTier}>
        <LimitText color='brand-secondary'>
          <FormattedMessage
            id='scenes.exchange.exchangeform.limit_info.upgrade'
            defaultMessage='Upgrade'
          />
        </LimitText>
        <TierIcon name='down-arrow-filled' color='brand-secondary' />
      </TierLink>
    )
  if (lastTierInReview)
    return (
      <LinkContainer to='/swap/profile'>
        <TierLink>
          <LimitText color='btc'>
            <FormattedMessage
              id='scenes.exchange.exchangeform.limit_info.tier_in_review'
              defaultMessage='Tier {tierIndex} In Review'
              values={{ tierIndex: nextTier }}
            />
          </LimitText>
          <TierIcon name='down-arrow-filled' color='btc' />
        </TierLink>
      </LinkContainer>
    )

  return null
}
export class LimitInfo extends React.PureComponent {
  upgradeTier = () => {
    const { actions, nextTier, upgradeRequired } = this.props
    actions.verifyIdentity(nextTier, false, upgradeRequired)
  }

  render () {
    const {
      tier,
      nextTier,
      limit,
      showLimit,
      showPending,
      hideTier,
      currencySymbol,
      nextTierAvailable,
      lastTierInReview,
      upgradeRequired
    } = this.props

    if (hideTier) return null

    return (
      <LimitRow>
        <Group>
          <LimitText color='brand-primary'>
            <FormattedMessage
              id='scenes.exchange.exchangeform.limit_info.tier'
              defaultMessage='Tier {tierIndex}'
              values={{ tierIndex: tier }}
            />
            {(showLimit || upgradeRequired || showPending) && ' -'}
          </LimitText>
          <LimitMessage
            currencySymbol={currencySymbol}
            limit={limit}
            showLimit={showLimit}
            showPending={showPending}
            upgradeRequired={upgradeRequired}
          />
        </Group>
        <LimitAction
          nextTier={nextTier}
          nextTierAvailable={nextTierAvailable}
          lastTierInReview={lastTierInReview}
          upgradeRequired={upgradeRequired}
          upgradeTier={this.upgradeTier}
        />
      </LimitRow>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.identityVerification, dispatch)
})

export default connect(
  getData,
  mapDispatchToProps
)(LimitInfo)
