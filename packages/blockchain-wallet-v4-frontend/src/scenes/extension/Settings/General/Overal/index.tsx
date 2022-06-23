import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconChevronRightV2 } from '@blockchain-com/icons'

import { Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'

import { SettingsHeading } from '../..'
import { SettingsLink, SettingsList } from '../../Overal'

export const Overal = (props) => {
  const { path } = props.match

  return (
    <>
      <SettingsHeading>General</SettingsHeading>
      <SettingsList>
        <SettingsLink to={`${path}/local-currency`} style={{ color: 'red' }}>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text>Local Curency</Text>
            <Icon color='white800' label='IconBack' size='md'>
              <IconChevronRightV2 />
            </Icon>
          </Flex>
        </SettingsLink>
        <SettingsLink to={`${path}/language`} style={{ color: 'red' }}>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text>Language</Text>
            <Icon color='white800' label='IconBack' size='md'>
              <IconChevronRightV2 />
            </Icon>
          </Flex>
        </SettingsLink>
      </SettingsList>
    </>
  )
}
