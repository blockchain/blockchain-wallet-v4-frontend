import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Flex,
  IconCloseCircleV2,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'

import { CloseIcon } from './styles'
import { HeaderProps } from './types'

const Header = ({ onClickClose }: HeaderProps) => {
  return (
    <Flex justifyContent='space-between'>
      <Text color={SemanticColors.body} variant='title2'>
        <FormattedMessage id='copy.select_token' defaultMessage='Select Token' />
      </Text>
      <CloseIcon onClick={onClickClose}>
        <IconCloseCircleV2 label='close' size='medium' color={PaletteColors['grey-400']} />
      </CloseIcon>
    </Flex>
  )
}

export default Header
