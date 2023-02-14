import React, { ReactNode } from 'react'
import { Flex, IconInformation, SemanticColors } from '@blockchain-com/constellation'

import { Text, TooltipHost } from 'blockchain-info-components'

import { DetailsContainer } from './AccountSummary.model'

const Details = ({
  handleClick,
  subText,
  subValue,
  text,
  textTooltipId,
  tooltipId,
  value
}: DetailsType) => (
  <DetailsContainer $hasHandleClick={!!handleClick} onClick={handleClick}>
    <Flex alignItems='center' gap={4} justifyContent='space-between'>
      <Text color='grey900' size='14px' weight={600}>
        <Flex flexDirection='row' gap={8}>
          {text}
          {textTooltipId && (
            <TooltipHost id={textTooltipId}>
              <IconInformation name='info' size='small' color={SemanticColors.muted} />
            </TooltipHost>
          )}
        </Flex>
      </Text>
      <Text color='grey900' size='14px' weight={600}>
        {value}
      </Text>
    </Flex>
    <Flex alignItems='center' gap={4} justifyContent='space-between'>
      {subText && (
        <Flex alignItems='center' gap={4}>
          <Text color='grey700' size='14px' weight={500}>
            {subText}
          </Text>
          {tooltipId && (
            <TooltipHost id={tooltipId}>
              <IconInformation name='info' size='small' color={SemanticColors.muted} />
            </TooltipHost>
          )}
        </Flex>
      )}
      {subValue && (
        <Text color='grey700' size='14px' weight={500}>
          {subValue}
        </Text>
      )}
    </Flex>
  </DetailsContainer>
)
type DetailsType = {
  handleClick?: () => void
  subText?: ReactNode
  subValue?: ReactNode | number | string
  text: ReactNode
  textTooltipId?: string
  tooltipId?: string
  value: ReactNode | number | string
}

export default Details
