import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import { Button, Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { Image } from 'blockchain-info-components'

import { SlidePropsType } from '../Earn.types'
import { DescriptionContainer } from './Slide.styles'

export const Slide = ({ description, image, isActiveRewards, link, title }: SlidePropsType) => (
  <Flex alignItems='center' flexDirection='column' gap={24}>
    <Image name={image} />
    <Flex alignItems='center' flexDirection='column'>
      <Text variant='title2' textAlign='center' color={SemanticColors.title}>
        {title}
      </Text>
      <DescriptionContainer>
        <Flex justifyContent='center'>
          <Text color={SemanticColors.body} textAlign='center' variant='body1'>
            {description}
          </Text>
        </Flex>
      </DescriptionContainer>
      {link && (
        <Padding top={0.5}>
          {isActiveRewards ? (
            <LinkContainer to={link}>
              <Button
                as='a'
                size='small'
                state='initial'
                text={<FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />}
                type='button'
                variant='minimal'
                width='auto'
              />
            </LinkContainer>
          ) : (
            <Button
              as='a'
              href={link}
              size='small'
              state='initial'
              target='_blank'
              text={<FormattedMessage id='buttons.learn_more' defaultMessage='Learn More' />}
              type='button'
              variant='minimal'
              width='auto'
            />
          )}
        </Padding>
      )}
    </Flex>
  </Flex>
)

export default Slide
