import React from 'react'

import { getAuthorizeVerifyDevice } from 'data/auth/selectors'
import { useRemote } from 'hooks'

import { Props } from '..'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const VerifyMagicLink = (props: Props) => {
  const { data, error, isLoading, isNotAsked } = useRemote(getAuthorizeVerifyDevice)

  if (isLoading || isNotAsked) return <Loading />

  if (error) return <Error error={error} />
  return <Success {...props} {...data} />
}

export default VerifyMagicLink
