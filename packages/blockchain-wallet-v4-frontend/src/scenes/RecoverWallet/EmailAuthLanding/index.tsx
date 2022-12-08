import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { Wrapper } from 'components/Public'
import { selectors } from 'data'
import { Analytics } from 'data/types'

import { Props as OwnProps } from '..'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const VerifyAccountRecovery = ({ analyticsActions, data, signupActions }: Props) => {
  useEffect(() => {
    signupActions.approveAccountReset()
    analyticsActions.trackEvent({
      key: Analytics.ACCOUNT_RECOVERY_EMAIL_CLICKED,
      properties: {}
    })
  }, [])

  return (
    <Wrapper>
      {data.cata({
        Failure: (error) => <Error error={error} />,
        Loading: () => <Loading />,
        NotAsked: () => <Error />,
        Success: () => <Success />
      })}
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  data: selectors.signup.getAccountRecoveryVerify(state)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector> & OwnProps

export default connector(VerifyAccountRecovery)
