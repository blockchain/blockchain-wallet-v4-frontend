import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Flex, Link, SemanticColors, Text } from '@blockchain-com/constellation'

import { RoundedBadge } from 'components/Badge'

import { VerticalDivider } from './LearnColumn.styles'
import { LearnColumnPropsType } from './LearnColumn.types'

const LearnColumn = ({
  description,
  handleClick,
  icon,
  isActiveRewards,
  link,
  showDivider,
  title
}: LearnColumnPropsType) => (
  <Flex alignItems='center' gap={16}>
    {showDivider && <VerticalDivider />}
    <Flex flexDirection='column' gap={12} justifyContent='space-between'>
      <Flex flexDirection='column' gap={8}>
        <Flex alignItems='center' gap={8}>
          {icon}
          <Text color={SemanticColors.body} variant='paragraph1'>
            {title}
          </Text>
          {isActiveRewards && (
            <RoundedBadge>
              <FormattedMessage defaultMessage='New' id='copy.new' />
            </RoundedBadge>
          )}
        </Flex>
        <Flex>
          <Text color={SemanticColors.title} variant='paragraph1'>
            {description}
          </Text>
        </Flex>
      </Flex>
      {isActiveRewards ? (
        <LinkContainer to={link}>
          <a>
            <Link
              onClick={handleClick}
              size='small'
              text={<FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />}
            />
          </a>
        </LinkContainer>
      ) : handleClick ? (
        <Button
          onClick={handleClick}
          size='small'
          text={<FormattedMessage id='button.compare' defaultMessage='Compare' />}
          variant='minimal'
        />
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

export default LearnColumn
