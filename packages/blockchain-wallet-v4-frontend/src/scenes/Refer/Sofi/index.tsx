import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

const SofiReferralComponent: React.FC<RouteComponentProps> = ({ location }) => {
  const searchParams = new URLSearchParams(location.search)
  const hasAllRequiredJwtParams = ['aesCiphertext', 'aesIV', 'aesTag', 'aesKeyCiphertext'].every(
    (param) => searchParams.has(param)
  )

  let redirectTo = ''
  let queryString = ''

  if (hasAllRequiredJwtParams) {
    redirectTo = '/sofi'
    queryString = location.search
  } else {
    redirectTo = 'https://blockchainwallet.page.link/buysofi'
    const viewParam = searchParams.get('buy')
    if (viewParam) {
      queryString = `?code=${viewParam}`
    } else {
      queryString = '?ref=sofi'
    }
  }

  return <Redirect to={redirectTo + queryString} />
}

export default SofiReferralComponent
