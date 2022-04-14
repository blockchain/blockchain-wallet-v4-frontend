import React, { ReactElement } from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconLink } from '@blockchain-com/icons'

import { Link } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

export const defaultAboutSectionActions: ReactElement[] = [
  <Link key={1}>
    <Flex gap={8} alignItems='center'>
      <Icon label='link' size='sm' color='blue600'>
        <IconLink />
      </Icon>
      Official Website
    </Flex>
  </Link>,

  <Link key={2}>
    <Flex gap={8} alignItems='center'>
      <Icon label='link' size='sm' color='blue600'>
        <IconLink />
      </Icon>
      Whitepaper
    </Flex>
  </Link>
]
