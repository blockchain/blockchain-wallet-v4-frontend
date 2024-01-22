import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

const SofiReferralComponent: React.FC<RouteComponentProps> = ({ location }) => {
  const searchParams = new URLSearchParams(location.search)
  const hasAllRequiredJwtParams = ['aesCiphertext', 'aesIV', 'aesTag', 'aesKeyCiphertext'].every(
    (param) => searchParams.has(param)
  )

  let redirectTo = ''
  if (hasAllRequiredJwtParams) {
    redirectTo = '/sofi'
  } else {
    redirectTo = 'https://blockchainwallet.page.link/buysofi'
    const viewParam = searchParams.get('buy')
    if (viewParam) {
      redirectTo += `?code=${viewParam}`
    } else {
      redirectTo += `?ref=sofi`
    }
  }

  redirectTo += location.search

  return <Redirect to={redirectTo} />
}

export default SofiReferralComponent
