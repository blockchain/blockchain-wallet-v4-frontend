import React, { ReactNode } from 'react'

import { Icon, Text, TooltipHost } from 'blockchain-info-components'

import {
  DetailsContainer,
  LeftContainer,
  RightContainer,
  SubTextContainer
} from './AccountSummary.model'

const Details = ({ subText, subValue, text, tooltipId, value }: DetailsType) => (
  <DetailsContainer>
    <LeftContainer>
      <Text color='grey900' size='14px' weight={600}>
        {text}
      </Text>
      {subText && (
        <SubTextContainer>
          <Text color='grey700' size='14px' weight={500}>
            {subText}
          </Text>
          {tooltipId && (
            <TooltipHost id={tooltipId}>
              <Icon name='info' size='12px' color='grey400' />
            </TooltipHost>
          )}
        </SubTextContainer>
      )}
    </LeftContainer>
    <RightContainer>
      <Text color='grey900' size='14px' weight={600}>
        {value}
      </Text>
      {subValue && (
        <Text color='grey700' size='14px' weight={500}>
          {subValue}
        </Text>
      )}
    </RightContainer>
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
