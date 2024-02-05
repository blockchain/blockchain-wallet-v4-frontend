import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import { getDomains } from '@core/redux/walletOptions/selectors'
import { actions, selectors } from 'data'
import { SofiUserMigrationStatus } from 'data/types'

const SofiReferralComponent: React.FC = () => {
  const dispatch = useDispatch()

  const {
    data: { api }
  } = useSelector(getDomains)

  const search = useSelector(selectors.router.getSearch) as string

  const url = window.location.href
  const getQueryParamCaseInsensitive = (url, paramName) => {
    const searchParams = new URLSearchParams(search)
    // Create URLSearchParams object from the URL
    const normalizedParamName = paramName.toLowerCase()
    // Iterate over all query parameters
    // eslint-disable-next-line
    for (const [key, value] of searchParams) {
      if (key.toLowerCase() === normalizedParamName) {
        return value
      }
    }
    // If the parameter is not found, return null or undefined
    return null
  }

  const sofiReferralRedirect = async () => {
    const searchParams = new URLSearchParams(search)
    const hasAllRequiredJwtParams = ['aesCiphertext', 'aesIV', 'aesTag', 'aesKeyCiphertext'].every(
      (param) => searchParams.has(param)
    )

    // if jwt is present, check the migration status
    let migrationStatus
    if (hasAllRequiredJwtParams) {
      const aesCiphertext = getQueryParamCaseInsensitive(url, 'aesCiphertext') as string
      const aesIV = getQueryParamCaseInsensitive(url, 'aesIV') as string
      const aesTag = getQueryParamCaseInsensitive(url, 'aesTag') as string
      const aesKeyCiphertext = getQueryParamCaseInsensitive(url, 'aesKeyCipherText') as string
      const response = await axios.get(`${api}/nabu-gateway/sofi/user-migration-status`, {
        headers: {
          'Content-Type': 'application/json',
          'X-SoFi-AES-IV': aesIV,
          'X-SoFi-AES-Key-Ciphertext': aesKeyCiphertext,
          'X-SoFi-AES-Tag': aesTag,
          'X-SoFi-JWT-AES-Ciphertext': aesCiphertext
        }
      })
      migrationStatus = response.data.migrationStatus
    }

    if (hasAllRequiredJwtParams && migrationStatus === SofiUserMigrationStatus.AWAITING_USER) {
      dispatch(actions.router.push(`/sofi${search}`))
    } else {
      const viewParam = searchParams.get('buy')?.toUpperCase()
      const queryString = viewParam ? `?code=${viewParam}&ref=sofi` : '?ref=sofi'

      window.location.href = `https://blockchainwallet.page.link/buysofi${queryString}`
    }
  }

  useEffect(() => {
    sofiReferralRedirect()
  }, [])

  return null
}

export default SofiReferralComponent
