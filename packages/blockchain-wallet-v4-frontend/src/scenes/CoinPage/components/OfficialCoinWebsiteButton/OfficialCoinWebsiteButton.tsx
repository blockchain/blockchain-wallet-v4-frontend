import React, { FC } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconLink, PaletteColors } from '@blockchain-com/constellation'

import { Link } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

const OfficialCoinWebsiteButton: FC<{ href: string }> = ({ href }) => (
  <Link href={href} target='_blank'>
    <Flex gap={8} alignItems='center'>
      <IconLink color={PaletteColors['blue-600']} label='link' size='small' />
      <FormattedMessage
        id='coinView.aboutSection.officialWebsiteButton.label'
        defaultMessage='Official Website'
      />
    </Flex>
  </Link>
)

export default OfficialCoinWebsiteButton
