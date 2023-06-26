import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Image } from 'blockchain-info-components'

const SettingsIcon = styled.div`
  cursor: pointer;
`

export const Header = ({ onClickSettings }: { onClickSettings: () => void }) => {
  return (
    <Padding bottom={1}>
      <Flex justifyContent='space-between'>
        <Text variant='title2' color={SemanticColors.title}>
          <FormattedMessage id='copy.swap' defaultMessage='Swap' />
        </Text>
        <SettingsIcon onClick={onClickSettings}>
          <Image name='cog' size='24px' />
        </SettingsIcon>
      </Flex>
    </Padding>
  )
}
