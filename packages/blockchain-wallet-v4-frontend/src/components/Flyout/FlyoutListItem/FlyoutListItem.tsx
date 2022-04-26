import { Expanded, Flex } from 'components/Flex'
import { Padding } from 'components/Padding'
import React from 'react'
import { FlyoutListItemComponent } from './FlyoutListItem.types'
import { Text } from 'blockchain-info-components'
import { ClickableArea } from 'components/ClickableArea'

export const FlyoutListItem: FlyoutListItemComponent = ({
  endIcon,
  icon,
  title,
  subtitle,
  onClick
}) => {
  return (
    <ClickableArea onClick={onClick}>
      <Padding vertical={24} horizontal={40}>
        <Flex gap={16} alignItems='center'>
          {icon}

          <Expanded>
            <Flex gap={2} flexDirection='column'>
              <Text weight={600} size='16px' lineHeight='24px' color='grey900'>
                {title}
              </Text>

              {!!subtitle && (
                <Text weight={500} size='14px' lineHeight='20px' color='grey600'>
                  {subtitle}
                </Text>
              )}
            </Flex>
          </Expanded>

          {endIcon}
        </Flex>
      </Padding>
    </ClickableArea>
  )
}
