import React, { useState } from 'react'
import {
  Flex,
  IconChevronDown,
  IconChevronUp,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'

import { FaqType } from '../Faq.types'
import { FaqItemContainer } from './FaqItem.model'

const FaqItem = ({ answer, question }: Partial<FaqType>) => {
  const [isActive, setIsActive] = useState<boolean>(false)

  const handleClick = () => {
    setIsActive(!isActive)
  }

  return (
    <FaqItemContainer onClick={handleClick}>
      <Flex alignItems='center' justifyContent='space-between' gap={16}>
        <Text color={SemanticColors.title} variant='paragraph2'>
          {question}
        </Text>
        {isActive ? (
          <IconChevronUp color={SemanticColors.muted} size='medium' />
        ) : (
          <IconChevronDown color={SemanticColors.muted} size='medium' />
        )}
      </Flex>
      {isActive && (
        <Text color={SemanticColors.body} variant='paragraph1'>
          {answer}
        </Text>
      )}
    </FaqItemContainer>
  )
}

export default FaqItem
