import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import { getData } from '../selectors'
import { Container } from './styles'

export const UkFooterBanner = ({ approvalDate }: { approvalDate?: string }) => {
  const { country } = useSelector(getData)
  if (!approvalDate) return null
  if (country !== 'GB') return null

  return (
    <Container>
      <span>
        <FormattedMessage
          id='uk.footer.banner.title'
          defaultMessage='This Financial Promotion has been approved by Helford Capital Partners LLP on {approvalDate}.'
          values={{ approvalDate }}
        />
      </span>
    </Container>
  )
}
