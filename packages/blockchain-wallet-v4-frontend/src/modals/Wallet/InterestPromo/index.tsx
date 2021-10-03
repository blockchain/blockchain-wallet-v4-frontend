import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { RemoteDataType } from 'blockchain-wallet-v4/src/types'
import { actions } from 'data'
import { RootState } from 'data/rootReducer'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import getData from './selectors'
import Success from './template'

const InterestPromo: React.FC<Props> = (props: Props) => {
  useEffect(() => {
    props.interestActions.fetchInterestRate()
  }, [props.interestActions])

  return (
    <>
      {props.data.cata({
        Failure: () => null,
        Loading: () => null,
        NotAsked: () => null,
        Success: (val) => <Success {...props} {...val} />
      })}
    </>
  )
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  interestActions: bindActionCreators(actions.components.interest, dispatch)
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

const enhance = compose(modalEnhancer(ModalName.INTEREST_PROMO_MODAL), connector)

export default enhance(InterestPromo)
