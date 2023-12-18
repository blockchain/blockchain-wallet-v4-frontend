import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { useRemote } from 'hooks'

import SofiErrorLanding from './template.error'
import Loading from './template.loading'
import SofiSuccessLanding from './template.success'

const ContentWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

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

  if (isLoading || isNotAsked) {
    return <Loading />
  }

  return (
    <>
      {error && <SofiErrorLanding />}
      {data && <SofiSuccessLanding />}
    </>
  )
}

export default SofiLanding
