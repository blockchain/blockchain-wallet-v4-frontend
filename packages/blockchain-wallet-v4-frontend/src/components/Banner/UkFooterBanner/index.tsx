import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import { getData } from '../selectors'
import { Container } from './styles'

export const UkFooterBanner = () => {
  const { country } = useSelector(getData)
  if (country !== 'GB') return null

  return (
    <Container>
      <span>
        <FormattedMessage
          id='uk.footer.banner.title'
          defaultMessage='This promotion has been approved by Helford Capital Partners LLP on 7 October 2023.'
        />
      </span>
    </Container>
  )
}
