import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const Header: FC = ({ children }) => {
  return (
    <Flex justifyContent='space-between' alignItems='center' gap={8}>
      <Text size='20px' weight={600} lineHeight='30px' color='grey900'>
        <FormattedMessage id='coinView.activityFeedCard.header' defaultMessage='Activity' />
      </Text>

      <Flex gap={8}>{children}</Flex>
    </Flex>
  )
}

export default Header
