import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import { getData } from '../selectors'
import { Container } from './styles'

export const UkFooterBanner = ({ approvalDate }: { approvalDate?: string }) => {
  const { country, ipCountry, signupCountry } = useSelector(getData)
  if (!approvalDate) return null
  const userCountry = country !== undefined ? country : ipCountry
  const hideBanner = userCountry !== 'GB' && signupCountry !== 'GB'
  if (hideBanner) return null

  return (
    <Container>
      <span>
        <FormattedMessage
          id='uk.footer.banner.title'
          defaultMessage='This Financial Promotion has been approved by Englebert Ltd on {approvalDate}.'
          values={{ approvalDate }}
        />
      </span>
    </Container>
  )
}
