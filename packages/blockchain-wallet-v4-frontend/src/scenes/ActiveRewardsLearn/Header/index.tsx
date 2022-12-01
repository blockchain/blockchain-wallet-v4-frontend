import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Flex, IconChevronLeft, SemanticColors, Text } from '@blockchain-com/constellation'

import { Link } from 'blockchain-info-components'

const Header = () => (
  <Flex flexDirection='column' gap={24}>
    <LinkContainer to='/earn'>
      <Link>
        <Flex alignItems='center'>
          <IconChevronLeft color={SemanticColors.primary} size='medium' />
          <Text color={SemanticColors.primary} variant='caption1'>
            <FormattedMessage id='copy.earn' defaultMessage='Earn' />
          </Text>
        </Flex>
      </Link>
    </LinkContainer>
    <Flex alignItems='center' gap={16} justifyContent='space-between'>
      <Text color={SemanticColors.title} variant='title1'>
        <FormattedMessage
          id='scenes.earn.active-rewards-earn.title'
          defaultMessage='Active Rewards'
        />
      </Text>
      <Button
        // eslint-disable-next-line no-console
        onClick={console.log}
        size='default'
        text={<FormattedMessage id='copy.get-started' defaultMessage='Get Started' />}
        variant='primary'
      />
    </Flex>
  </Flex>
)

export default Header
