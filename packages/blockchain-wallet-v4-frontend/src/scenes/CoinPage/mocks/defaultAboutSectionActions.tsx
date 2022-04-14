import React, { ReactElement } from 'react'
import { Icon, IconName } from '@blockchain-com/constellation'

import { Link } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

export const defaultAboutSectionActions: ReactElement[] = [
  <Link key={1}>
    <Flex gap={8} alignItems='center'>
      <Icon name={IconName.LINK} size='sm' color='currentColor' />
      Official Website
    </Flex>
  </Link>,

  <Link key={2}>
    <Flex gap={8} alignItems='center'>
      <Icon name={IconName.LINK} size='sm' color='currentColor' />
      Whitepaper
    </Flex>
  </Link>
]
