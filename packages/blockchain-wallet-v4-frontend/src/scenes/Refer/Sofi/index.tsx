import React, { useEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

const SofiReferralComponent: React.FC = () => {
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const hasAllRequiredJwtParams = ['aesCiphertext', 'aesIV', 'aesTag', 'aesKeyCiphertext'].every(
      (param) => searchParams.has(param)
    )

    // if jwt is present, check the migration status

    // if (hasAllRequiredJwtParams && migrationPending) {
    if (hasAllRequiredJwtParams) {
      history.push(`/sofi${location.search}`)
    } else {
      const viewParam = searchParams.get('buy')
      const queryString = viewParam ? `?code=${viewParam}&ref=sofi` : '?ref=sofi'

      window.location.href = `https://blockchainwallet.page.link/buysofi${queryString}`
    }
  }, [location, history])

  return null
}

export default SofiReferralComponent
