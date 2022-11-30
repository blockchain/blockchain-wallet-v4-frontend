import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { Flex, Link } from '@blockchain-com/constellation'

import { RoundedBadge } from 'components/Badge'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { learnColumn, VerticalLine, Wrapper } from './Learn.model'
import { LearnColumnType } from './Learn.types'

const Learn = () => {
  const isActiveRewardsEnabled = useSelector(
    (state: RootState) =>
      selectors.core.walletOptions.getActiveRewardsEnabled(state).getOrElse(false) as boolean
  )

  const renderLearnColumn = (
    { description, icon, isActiveRewards, link, title }: LearnColumnType,
    i: number
  ) => {
    if (!isActiveRewardsEnabled && isActiveRewards) return null

    return (
      <Flex alignItems='center' gap={16} key={i}>
        {i > 0 && <VerticalLine />}
        <Flex flexDirection='column' gap={12} justifyContent='space-between'>
          <Flex flexDirection='column' gap={8}>
            <Flex alignItems='center' gap={8}>
              {icon}
              {title}
              {isActiveRewards && (
                <RoundedBadge>
                  <FormattedMessage defaultMessage='New' id='copy.new' />
                </RoundedBadge>
              )}
            </Flex>
            <Flex>{description}</Flex>
          </Flex>
          {isActiveRewards ? (
            <LinkContainer to={link}>
              <a>
                <Link
                  size='small'
                  text={<FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />}
                />
              </a>
            </LinkContainer>
          ) : (
            <Link
              href={link}
              target='_blank'
              size='small'
              text={<FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />}
            />
          )}
        </Flex>
      </Flex>
    )
  }

  return <Wrapper>{learnColumn.map(renderLearnColumn)}</Wrapper>
}

export default Learn
