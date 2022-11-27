import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Flex,
  IconSettings,
  Padding,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import styled from 'styled-components'

const SettingsIcon = styled.div`
  cursor: pointer;
`

export const Header = ({ onClickSettings }: { onClickSettings: () => void }) => {
  const { formatMessage } = useIntl()
  return (
    <Padding bottom={1}>
      <Flex justifyContent='space-between'>
        <Text variant='title2' color={SemanticColors.title}>
          <FormattedMessage id='copy.swap' defaultMessage='Swap' />
        </Text>
        <SettingsIcon onClick={onClickSettings}>
          <IconSettings
            size='medium'
            color={PaletteColors['grey-400']}
            label={formatMessage({ defaultMessage: 'Settings', id: 'copy.settings' })}
          />
        </SettingsIcon>
      </Flex>
    </Padding>
  )
}
