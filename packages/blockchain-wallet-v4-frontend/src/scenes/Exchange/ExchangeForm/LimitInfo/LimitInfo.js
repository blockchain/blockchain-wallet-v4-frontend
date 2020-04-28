import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { ExchangeText } from 'components/Exchange'
import { FormattedMessage } from 'react-intl'
import { getData } from './selectors'
import { Icon, Link } from 'blockchain-info-components'
import { levelName } from 'components/IdentityVerification/TierCard/services'
import { LinkContainer } from 'react-router-bootstrap'
import { path } from 'ramda'
import { Row } from '../Layout'
import { TIERS } from 'components/IdentityVerification/TierCard/model'
import { unsafe_deprecated_fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'
import React from 'react'
import styled from 'styled-components'

const LimitText = styled(ExchangeText)`
  font-weight: 500;
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
`
const TierIcon = styled(Icon)`
  margin-left: 8px;
  font-size: 16px;
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
            amount: unsafe_deprecated_fiatToString({
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
        <LimitText color='blue600'>
          <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
        </LimitText>
        <TierIcon name='chevron-right-large' color='blue600' />
      </TierLink>
    )

  if (nextTierAvailable)
    return (
      <TierLink onClick={upgradeTier}>
        <LimitText color='blue600'>
          <FormattedMessage
            id='scenes.exchange.exchangeform.limit_info.upgrade'
            defaultMessage='Upgrade'
          />
        </LimitText>
        <TierIcon name='chevron-right-large' color='blue600' />
      </TierLink>
    )
  if (lastTierInReview)
    return (
      <LinkContainer to='/swap/profile'>
        <TierLink>
          <LimitText color='btc'>
            <FormattedMessage
              id='scenes.exchange.exchangeform.limit_info.levelinreview'
              defaultMessage='{level} In Review'
              values={{ level: levelName[path([nextTier, 'level'], TIERS)] }}
            />
          </LimitText>
          <TierIcon name='chevron-right-large' color='btc' />
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
          <LimitText color='blue900'>
            <FormattedMessage
              id='scenes.exchange.exchangeform.limit_info.level'
              defaultMessage='{level}'
              values={{ level: levelName[path([tier, 'level'], TIERS)] }}
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
