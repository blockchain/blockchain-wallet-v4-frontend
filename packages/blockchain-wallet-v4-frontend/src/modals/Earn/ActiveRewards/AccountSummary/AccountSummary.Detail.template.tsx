import React, { ReactNode } from 'react'
import { Flex, IconInformation, SemanticColors, Text } from '@blockchain-com/constellation'

import { TooltipHost } from 'blockchain-info-components'

import { DetailsContainer } from './AccountSummary.styles'

const Details = ({
  handleClick,
  subText,
  subTextTooltipId,
  subValue,
  text,
  textTooltipId,
  value
}: DetailsType) => (
  <DetailsContainer $hasHandleClick={!!handleClick} onClick={handleClick}>
    <Flex alignItems='center' gap={4} justifyContent='space-between'>
      <Text color={SemanticColors.title} variant='paragraph2'>
        <Flex flexDirection='row' gap={8}>
          {text}
          {textTooltipId && (
            <TooltipHost id={textTooltipId}>
              <IconInformation name='info' size='small' color={SemanticColors.muted} />
            </TooltipHost>
          )}
        </Flex>
      </Text>
      <Text color={SemanticColors.title} variant='paragraph2'>
        {value}
      </Text>
    </Flex>
    <Flex alignItems='center' gap={4} justifyContent='space-between'>
      {subText && (
        <Flex alignItems='center' gap={4}>
          <Text color={SemanticColors.body} variant='paragraph1'>
            {subText}
          </Text>
          {subTextTooltipId && (
            <TooltipHost id={subTextTooltipId}>
              <IconInformation name='info' size='small' color={SemanticColors.muted} />
            </TooltipHost>
          )}
        </Flex>
      )}
      {subValue && (
        <Text color={SemanticColors.body} variant='paragraph1'>
          {subValue}
        </Text>
      )}
    </Flex>
  </DetailsContainer>
)
type DetailsType = {
  handleClick?: () => void
  subText?: ReactNode
  subTextTooltipId?: string
  subValue?: ReactNode | number | string
  text: ReactNode
  textTooltipId?: string
  value: ReactNode | number | string
}

export default Details
