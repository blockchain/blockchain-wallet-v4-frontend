import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconLink } from '@blockchain-com/icons'

import { Link } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const OfficialCoinWebsiteButton: FC<{ href: string }> = ({ href }) => (
  <Link href={href} target='_blank'>
    <Flex gap={8} alignItems='center'>
      <Icon label='link' size='sm' color='blue600'>
        <IconLink />
      </Icon>

      <FormattedMessage
        id='coinView.aboutSection.officialWebsiteButton.label'
        defaultMessage='Official Website'
      />
    </Flex>
  </Link>
)

export default OfficialCoinWebsiteButton
