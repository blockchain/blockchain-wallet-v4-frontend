import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import { getData } from '../selectors'
import { Container } from './styles'

export const UkFooterBanner = () => {
  const { country, ipCountry, signupCountry } = useSelector(getData)
  const userCountry = country !== undefined ? country : ipCountry
  const hideBanner = userCountry !== 'GB' && signupCountry !== 'GB'
  if (hideBanner) return null

  return (
    <Container>
      <span>
        <FormattedMessage
          id='uk.footer.banner.title'
          defaultMessage='This Financial Promotion has been approved by Helford Capital Partners LLP on 20 October 2023.'
        />
      </span>
    </Container>
  )
}
