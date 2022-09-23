import React, { ReactNode } from 'react'
import { Flex, IconInformation, SemanticColors } from '@blockchain-com/constellation'

import { Text, TooltipHost } from 'blockchain-info-components'

import { DetailsContainer } from './AccountSummary.model'

const Details = ({ subText, subValue, text, tooltipId, value }: DetailsType) => (
  <DetailsContainer>
    <Flex flexDirection='column' gap={4} justifyContent='center'>
      <Text color='grey900' size='14px' weight={600}>
        {text}
      </Text>
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
    </Flex>
    <Flex alignItems='flex-end' gap={4} flexDirection='column' justifyContent='center'>
      <Text color='grey900' size='14px' weight={600}>
        {value}
      </Text>
      {subValue && (
        <Text color='grey700' size='14px' weight={500}>
          {subValue}
        </Text>
      )}
    </Flex>
  </DetailsContainer>
)
type DetailsType = {
  subText?: ReactNode
  subValue?: ReactNode | number | string
  text: ReactNode
  tooltipId?: string
  value: ReactNode | number | string
}

export default Details
