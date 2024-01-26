import React from 'react'
import { FormattedMessage } from 'react-intl'
import { shallowEqual, useSelector } from 'react-redux'

import { Image, Link, Text } from 'blockchain-info-components'
import { selectors } from 'data'

import { getData } from '../selectors'
import { SofiRow } from './styles'

export const SofiBanner = ({ userLoggedOut = false }: { userLoggedOut?: boolean }) => {
  const { country, ipCountry, signupCountry } = useSelector(getData, shallowEqual)
  const sofiUserStatus = useSelector(selectors.modules.profile.getSofiUserMigrationStatus)
  const userCountry = country !== undefined ? country : ipCountry
  const hideBanner = userCountry !== 'US' && signupCountry !== 'US'
  if ((!userLoggedOut && hideBanner) || sofiUserStatus) return null

  return (
    <SofiRow>
      <Image name='sofi-finish-migration' size='20px' />
      <Text>
        <FormattedMessage
          id='banner.sofi.member_announcement.title'
          defaultMessage='SoFi Members:'
        />
      </Text>{' '}
      <Text>
        <FormattedMessage
          id='banner.sofi.member_announcement.description'
          defaultMessage='Are you migrating your crypto from SoFi? '
        />
      </Text>{' '}
      <Text>
        <Link
          href='https://support.blockchain.com/hc/en-us/articles/11822957488028-How-to-migrate-your-SoFi-crypto-account-to-Blockchain-com'
          target='_blank'
          weight={500}
          size='16px'
        >
          <FormattedMessage id='button.click_here' defaultMessage='Click Here' />
        </Link>
      </Text>
    </SofiRow>
  )
}
