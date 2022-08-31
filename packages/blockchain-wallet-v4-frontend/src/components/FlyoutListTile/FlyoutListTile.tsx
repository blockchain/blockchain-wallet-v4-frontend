import React from 'react'
import { PaletteColors } from '@blockchain-com/constellation'

import { Icon, Text } from 'blockchain-info-components'
import { ClickableArea } from 'components/ClickableArea'
import { Flex } from 'components/Flex'
import { IconCircularBackground } from 'components/IconCircularBackground'
import { Padding } from 'components/Padding'

import { FlyoutListTileComponent } from './FlyoutListTile.types'

export const FlyoutListTile: FlyoutListTileComponent = ({
  disabled = false,
  icon,
  iconColor,
  onClick,
  subtitle,
  title
}) => {
  const color = disabled ? PaletteColors['grey-700'] : iconColor

  const body = (
    <Padding vertical={24} horizontal={40}>
      <Flex gap={16} alignItems='center'>
        <IconCircularBackground color={color} backgroundOpacity={0.15}>
          <div style={{ color }}>{icon}</div>
        </IconCircularBackground>

        <Flex flexDirection='column' gap={2} flexGrow={1}>
          <Text weight={600} size='16px' lineHeight='24px' color='grey900'>
            {title}
          </Text>

          <Text weight={500} size='14px' lineHeight='21px' color='grey700'>
            {subtitle}
          </Text>
        </Flex>

        {disabled === false && <Icon name='chevron-right' size='24px' color='grey400' />}
      </Flex>
    </Padding>
  )

  if (disabled) {
    return body
  }

  return <ClickableArea onClick={onClick}>{body}</ClickableArea>
}
