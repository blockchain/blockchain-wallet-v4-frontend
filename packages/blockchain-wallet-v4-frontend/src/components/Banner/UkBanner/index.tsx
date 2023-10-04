import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { SemanticColors, Text } from '@blockchain-com/constellation'

import { getData } from './selectors'
import { LinkContainer } from './styles'

export const UkBanner = () => {
  const { country } = useSelector(getData)
  if (country !== 'GB') return null
  return (
    <LinkContainer
      href='https://support.blockchain.com/hc/en-us/articles/10618857176604-UK-FCA-Regulations'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Text color={SemanticColors.muted} textAlign='center' variant='caption1'>
        <FormattedMessage
          defaultMessage="Don't invest unless you're prepared to lose all the money you invest. This is a high-risk investment and you should not expect to be protected if something goes wrong."
          id='scene.nav,banner.uk.description1'
        />{' '}
        <Text color={SemanticColors.muted} variant='caption2'>
          <FormattedMessage
            defaultMessage='Take 2 mins to learn more'
            id='scene.nav,banner.uk.description2'
          />
        </Text>
      </Text>
    </LinkContainer>
  )
}
