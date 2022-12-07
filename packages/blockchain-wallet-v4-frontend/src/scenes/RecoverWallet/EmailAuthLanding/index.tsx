import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const VerifyAccountRecovery = ({ data, signupActions }: Props) => {
  useEffect(() => {
    signupActions.approveAccountReset()
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

const mapDispatchToProps = (dispatch) => ({
  signupActions: bindActionCreators(actions.signup, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

export default connector(VerifyAccountRecovery)
