import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

const VerifyEmailToken = ({ data, location, miscActions }: Props) => {
  const token = decodeURIComponent(location.pathname.split('/verify-email/')[1])

  useEffect(() => {
    miscActions.verifyEmailToken(token)
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
  appEnv: selectors.core.walletOptions.getAppEnv(state).getOrElse('prod'),
  data: selectors.core.data.misc.verifyEmailToken(state)
})

const mapDispatchToProps = (dispatch) => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & {
  location: { pathname: string; search: string }
}

export default connector(VerifyEmailToken)
