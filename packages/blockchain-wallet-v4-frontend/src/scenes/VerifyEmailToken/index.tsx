import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const VerifyEmailToken = ({ location }: Props) => {
  const token = decodeURIComponent(location.pathname.split('/verify-email/')[1])

  const dispatch = useDispatch()
  const data = useSelector(selectors.core.data.misc.verifyEmailToken)

  useEffect(() => {
    dispatch(actions.core.data.misc.verifyEmailToken(token))
  }, [])

  return (
    <Wrapper>
      {data.cata({
        Failure: (error) => <Error error={error} />,
        Loading: () => <Loading />,
        NotAsked: () => <Loading />,
        Success: () => <Success />
      })}
    </Wrapper>
  )
}

type Props = {
  location: { pathname: string; search: string }
}

export default VerifyEmailToken
