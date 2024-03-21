import React from 'react'

import { getAuthorizeVerifyDevice } from 'data/auth/selectors'
import { useRemote } from 'hooks'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const VerifyMagicLink = () => {
  const { data, error, isLoading, isNotAsked } = useRemote(getAuthorizeVerifyDevice)

  if (isLoading || isNotAsked) return <Loading />

  if (error) return <Error error={error} />
  return <Success {...data} />
}

export default VerifyMagicLink
