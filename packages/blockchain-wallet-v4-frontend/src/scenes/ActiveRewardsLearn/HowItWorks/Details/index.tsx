import React from 'react'
import {
  Flex,
  IconArrowDown,
  IconArrowRight,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'

import { useMedia } from 'services/styles'

import { DetailsPropsType, DetailType } from '../HowItWorks.types'
import {
  DetailItem,
  DetailsContainer,
  DetailsWrapper,
  IconCircle,
  IconContainer
} from './Details.model'

const Details = ({ details, id }: DetailsPropsType) => {
  const isMobile = useMedia('mobile')
  return (
    <DetailsWrapper>
      <IconContainer>
        <IconCircle>
          {isMobile ? (
            <IconArrowDown color={SemanticColors.title} size='small' />
          ) : (
            <IconArrowRight color={SemanticColors.title} size='small' />
          )}
        </IconCircle>
      </IconContainer>
      {details.map((detail: DetailType[], i: number) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <DetailsContainer key={id + i}>
            {detail.map(({ subText, text, title }, j: number) => (
              // eslint-disable-next-line react/no-array-index-key
              <DetailItem key={id + i + j} isFirstRow={j === 0}>
                <Text color={SemanticColors.title} variant='paragraph2'>
                  {title}
                </Text>
                {(subText || text) && (
                  <Flex
                    alignItems='flex-end'
                    flexDirection='column'
                    gap={4}
                    justifyContent='center'
                  >
                    {text && (
                      <Text color={SemanticColors.title} variant='paragraph2'>
                        {text}
                      </Text>
                    )}
                    {subText && (
                      <Text color={SemanticColors.body} variant='paragraph1'>
                        {subText}
                      </Text>
                    )}
                  </Flex>
                )}
              </DetailItem>
            ))}
          </DetailsContainer>
        )
      })}
    </DetailsWrapper>
  )
}

export default Details
