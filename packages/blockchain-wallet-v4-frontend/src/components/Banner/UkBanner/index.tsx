import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'

import { selectors } from 'data'

import { getData } from '../selectors'
import { LinkContainer } from './styles'

export const UkBanner = ({ userLoggedOut = false }: { userLoggedOut?: boolean }) => {
  const { country, ipCountry, signupCountry } = useSelector(getData)
  const userCountry = country !== undefined ? country : ipCountry
  const hideBanner = userCountry !== 'GB' && signupCountry !== 'GB'

  if (!userLoggedOut && hideBanner) return null

  return (
    <LinkContainer
      href='https://support.blockchain.com/hc/en-us/articles/10618857176604-UK-FCA-Regulations'
      target='_blank'
      rel='noopener noreferrer'
    >
      <span>
        <FormattedMessage
          defaultMessage="Don't invest unless you're prepared to lose all the money you invest. This is a high-risk investment and you should not expect to be protected if something goes wrong."
          id='scene.nav,banner.uk.description1'
        />{' '}
        <span>
          <FormattedMessage
            defaultMessage='Take 2 mins to learn more'
            id='scene.nav,banner.uk.description2'
          />
        </span>
      </span>
    </LinkContainer>
  )
}
