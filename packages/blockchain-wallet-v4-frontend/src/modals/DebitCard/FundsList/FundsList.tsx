import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { RemoteDataType } from '@core/remote/types'
import { duration } from 'components/Flyout'
import { actions } from 'data'
import { AccountType } from 'data/components/debitCard/types'
import { ModalName } from 'data/modals/types'
import { RootState } from 'data/rootReducer'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import { getData } from './FundsList.selector'
import FundsList from './FundsList.template'

const FundsListContainer = (props: Props) => {
  useEffect(() => {
    props.debitCardActions.getEligibleAccounts()
  }, [])

  return <FundsList {...props} />
}

const mapStateToProps = (state: RootState) => ({
  accountsR: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  debitCardActions: bindActionCreators(actions.components.debitCard, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  accountsR: RemoteDataType<string, Array<AccountType>>
}

export type Props = OwnProps & ModalPropsType & ConnectedProps<typeof connector>

const enhance = compose<React.ComponentType>(
  modalEnhancer(ModalName.FUNDS_LIST, { transition: duration })
)

export default connector(enhance(FundsListContainer))
