import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Flex,
  IconArrowLeft,
  Padding,
  PaletteColors,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'
import styled from 'styled-components'

const IconContainer = styled.div`
  cursor: pointer;
`

export const Header = ({ onClickBack }: { onClickBack: () => void }) => (
  <Padding bottom={1}>
    <Flex justifyContent='space-between' alignItems='center'>
      <div>
        <IconContainer onClick={onClickBack}>
          <IconArrowLeft color={PaletteColors['grey-400']} label='go back' size='medium' />
        </IconContainer>
        <Text variant='title2' color={SemanticColors.body}>
          <FormattedMessage id='copy.confirmSwap' defaultMessage='Confirm Swap' />
        </Text>
      </div>
      <div>
        <Text variant='title2' color={SemanticColors.body}>
          <FormattedMessage
            id='copy.secondsLeft'
            defaultMessage='{{seconds}} seconds left'
            values={{ seconds: 14 }}
          />
        </Text>
      </div>
    </Flex>
  </Padding>
)
