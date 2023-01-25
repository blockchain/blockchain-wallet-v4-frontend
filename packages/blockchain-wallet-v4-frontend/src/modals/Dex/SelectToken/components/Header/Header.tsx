import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Flex,
  IconCloseCircleV2,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import styled from 'styled-components'

export const CloseIcon = styled.div`
  cursor: pointer;
`

export const Header = ({ onClickClose }: { onClickClose: () => void }) => {
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
