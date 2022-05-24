import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { CardType } from '@core/network/api/buySell/types'
import { RemoteDataType } from '@core/remote/types'
import { duration } from 'components/Flyout'
import { actions, selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { RootState } from 'data/rootReducer'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import { getData } from './TerminateCard.selector'
import TerminateCard from './TerminateCard.template'

const TerminateCardContainer = (props: Props) => <TerminateCard {...props} />

const mapStateToProps = (state: RootState) => ({
  currentCard: selectors.components.debitCard.getCurrentCardSelected(state),
  terminateHandler: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  debitCardActions: bindActionCreators(actions.components.debitCard, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  currentCard: CardType
  debitCardActions: typeof actions.components.debitCard
  terminateHandler: RemoteDataType<string, string>
}

export type Props = OwnProps & ModalPropsType & ConnectedProps<typeof connector>

const enhance = compose<React.ComponentType>(
  modalEnhancer(ModalName.TERMINATE_CARD, { transition: duration })
)
export default connector(enhance(TerminateCardContainer))
