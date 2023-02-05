import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Flex, IconChevronLeft, SemanticColors, Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { CoinType, EarnEligibleType } from '@core/types'
import { Link } from 'blockchain-info-components'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { Analytics } from 'data/types'

const CustomLink = styled(Link)`
  width: fit-content;
`

const Header = () => {
  const dispatch = useDispatch()
  const eligible: EarnEligibleType = useSelector((state: RootState) =>
    selectors.components.interest.getActiveRewardsEligible(state).getOrElse({})
  )
  const eligibleCoins: CoinType[] = Object.keys(eligible)
  const isEligible =
    eligibleCoins.length > 0 && (eligible.eligible || eligible[eligibleCoins[0]].eligible)

  useEffect(() => {
    dispatch(actions.components.interest.fetchActiveRewardsEligible())
  }, [])

  const handleClick = () => {
    const coin = eligibleCoins[0]
    dispatch(actions.router.push('/earn'))
    dispatch(
      actions.components.interest.showActiveRewardsModal({
        coin,
        step: 'WARNING'
      })
    )
    dispatch(
      actions.analytics.trackEvent({
        key: Analytics.WALLET_ACTIVE_REWARDS_LEARNING_PAGE_GET_STARTED_CLICKED,
        properties: { currency: coin }
      })
    )
  }
  return (
    <Flex flexDirection='column' gap={24}>
      <LinkContainer to='/earn'>
        <CustomLink>
          <Flex alignItems='center'>
            <IconChevronLeft color={SemanticColors.primary} size='medium' />
            <Text color={SemanticColors.primary} variant='caption1'>
              <FormattedMessage id='copy.earn' defaultMessage='Earn' />
            </Text>
          </Flex>
        </CustomLink>
      </LinkContainer>
      <Flex alignItems='center' gap={16} justifyContent='space-between'>
        <Text color={SemanticColors.title} variant='title1'>
          <FormattedMessage
            id='scenes.earn.active-rewards-earn.title'
            defaultMessage='Active Rewards'
          />
        </Text>
        <Button
          disabled={!isEligible}
          onClick={handleClick}
          size='default'
          text={<FormattedMessage id='copy.get-started' defaultMessage='Get Started' />}
          variant='primary'
        />
      </Flex>
    </Flex>
  )
}

export default Header
