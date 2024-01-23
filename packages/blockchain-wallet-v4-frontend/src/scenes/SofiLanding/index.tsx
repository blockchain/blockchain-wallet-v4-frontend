import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { actions, selectors } from 'data'
import { SofiUserMigrationStatus } from 'data/types'
import { useRemote } from 'hooks'

import SofiErrorLanding from './template.error'
import Loading from './template.loading'
import SofiPendingLanding from './template.pending'
import SofiSuccessLanding from './template.success'

const SofiLanding = () => {
  const dispatch = useDispatch()
  // use effect of checking sofi migration status
  // if it's complete redirect to wallet
  // add loading state until we know for sure
  useEffect(() => {
    dispatch(actions.modules.profile.initiateSofiLanding())
  }, [])

  useEffect(() => {})

  const { data, error, isLoading, isNotAsked } = useRemote(
    selectors.modules.profile.getSofiUserData
  )
  // @ts-ignore
  const isPending = data?.migrationStatus === SofiUserMigrationStatus.PENDING
  // i need to fix this type but i don't want to do
  // so close to migration date when everything is working

  if (isLoading || isNotAsked) {
    return <Loading />
  }

  return (
    <>
      {error && <SofiErrorLanding />}
      {isPending && <SofiPendingLanding />}
      {data && !isPending && <SofiSuccessLanding />}
    </>
  )
}

export default SofiLanding
