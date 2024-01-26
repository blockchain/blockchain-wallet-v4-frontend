import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'

const SofiReferralComponent: React.FC<RouteComponentProps> = ({ location }) => {
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const viewParam = searchParams.get('buy')
    const queryString = viewParam ? `?code=${viewParam}` : '?ref=sofi'

    window.location.href = `https://blockchainwallet.page.link/buysofi${queryString}`
  }, [location])

  return null
}

export default SofiReferralComponent
