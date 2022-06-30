import React from 'react'
import { FormattedMessage } from 'react-intl'
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
      <SettingsHeading>
        <FormattedMessage id='layouts.wallet.header.general' defaultMessage='General' />
      </SettingsHeading>
      <SettingsList>
        <SettingsLink to={`${path}/local-currency`} style={{ color: 'red' }}>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text>
              <FormattedMessage
                id='scenes.settings.preferences.localcurrency.success.title'
                defaultMessage='Local Currency'
              />
            </Text>
            <Icon color='white800' label='IconBack' size='md'>
              <IconChevronRightV2 />
            </Icon>
          </Flex>
        </SettingsLink>
        <SettingsLink to={`${path}/language`} style={{ color: 'red' }}>
          <Flex justifyContent='space-between' alignItems='center'>
            <Text>
              <FormattedMessage
                id='scenes.settings.preferences.walletlanguage.success.title'
                defaultMessage='Wallet Language'
              />
            </Text>
            <Icon color='white800' label='IconBack' size='md'>
              <IconChevronRightV2 />
            </Icon>
          </Flex>
        </SettingsLink>
      </SettingsList>
    </>
  )
}
