import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'
import { Analytics } from 'data/types'

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
        NotAsked: () => <Loading />,
        Success: () => <Success />
      })}
    </Wrapper>
  )
}

const mapStateToProps = (state) => ({
  data: selectors.signup.getAccountRecoveryVerify(state)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  signupActions: bindActionCreators(actions.signup, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(VerifyAccountRecovery)
