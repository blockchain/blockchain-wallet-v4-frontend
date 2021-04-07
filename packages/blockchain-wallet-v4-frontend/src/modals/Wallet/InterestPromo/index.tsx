import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import modalEnhancer from 'providers/ModalEnhancer'

import { getData } from './selectors'
import Success from './template'

const InterestPromo: React.FC<Props> = props => {
  useEffect(() => {
    props.interestActions.fetchInterestRate()
  }, [])

  return (
    <>
      {props.data.cata({
        Success: val => <Success {...props} {...val} />,
        Failure: () => null,
        Loading: () => null,
        NotAsked: () => null
      })}
    </>
  )
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  interestActions: bindActionCreators(actions.components.interest, dispatch),
  analyticsActions: bindActionCreators(actions.analytics, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type OwnPropsType = {
  closeAll: () => void
  handleClose: () => void
  position: number
  total: number
}

export type SuccessStateType = ReturnType<typeof getData>['data']

export type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}

export type Props = OwnPropsType & ConnectedProps<typeof connector>

const enhance = compose(modalEnhancer('InterestPromo'), connector)

export default enhance(InterestPromo)
