import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { actions, model } from 'data'

import { getData } from './selectors'
import Template from './template.success'

const InterestBanner: React.FC<Props> = props => {
  useEffect(() => {
    props.interestActions.fetchInterestRate()
    props.analyticsActions.logEvent(model.analytics.ONE_CLICK_INTEREST.SEEN)
  }, [])

  return (
    <>
      {props.data.cata({
        Success: val => <Template {...props} {...val} />,
        Failure: () => null,
        Loading: () => null,
        NotAsked: () => null
      })}
    </>
  )
}

const mapStateToProps = (state): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnPropsType = {
  handleClose: () => void
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}

export type Props = OwnPropsType & ConnectedProps<typeof connector>

export default connector(InterestBanner)
