import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { IconChevronDownV2, IconChevronUpV2 } from '@blockchain-com/constellation'

import { AllCoinsType, Text } from 'blockchain-info-components'

import data from './data.json'
import { Lines } from './Lines'
import { Arrow, ContentWrapper, MainWrapper, Title } from './RiskInvestment.styles'

type Props = {
  coin: AllCoinsType
}

export const RiskInvestment = ({ coin }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleExpanded = () => {
    setIsExpanded((prevExpanded) => !prevExpanded)
  }

  const coinData = data.find((d) => d.coin === coin)

  if (!coinData) {
    return null
  }

  return (
    <MainWrapper expanded={isExpanded}>
      <Title>
        <Text size='16px' weight={600} color='grey900'>
          <FormattedMessage
            defaultMessage='Investment risk'
            id='scenes.coin.investement_risk.title'
          />
        </Text>
        <Arrow onClick={toggleExpanded}>
          {isExpanded ? (
            <IconChevronUpV2 label='up' size='small' />
          ) : (
            <IconChevronDownV2 label='down' size='small' />
          )}
        </Arrow>
      </Title>
      {coinData.sections.map((section) => (
        <ContentWrapper key={coin + section.title}>
          <Text size='14px' weight={600} color='grey900'>
            {section.title}
          </Text>
          <Text size='14px' weight={500} color='grey900'>
            {section.description}
          </Text>
          <Lines lines={section.lines} />
        </ContentWrapper>
      ))}
    </MainWrapper>
  )
}
