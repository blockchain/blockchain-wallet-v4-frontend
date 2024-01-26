import React from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'

const SofiReferralComponent: React.FC<RouteComponentProps> = ({ location }) => {
  const searchParams = new URLSearchParams(location.search)
  const viewParam = searchParams.get('buy')
  const queryString = viewParam ? `?code=${viewParam}` : '?ref=sofi'
  const redirectTo = `https://blockchainwallet.page.link/buysofi${queryString}`

  return <Redirect to={redirectTo} />
}

export default SofiReferralComponent
