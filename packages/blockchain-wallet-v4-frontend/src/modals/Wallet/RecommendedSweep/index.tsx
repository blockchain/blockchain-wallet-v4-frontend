import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import { getData } from './selectors'
import RecommendedImportedSweep from './template'

const RecommendedImportSweepContainer = (props: Props) => {
  const handleSubmit = () => {
    // props.sendBtcActions.initialized({
    // })
  }

  return <RecommendedImportedSweep {...props} onSubmit={handleSubmit} />
}

const mapStateToProps = (state) => ({
  activeAddresses: selectors.core.common.btc.getActiveAddresses(state).getOrElse([])
})

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  sendBtcActions: bindActionCreators(actions.components.sendBtc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(modalEnhancer(ModalName.RECOMMENDED_IMPORTED_SWEEP), connector)

type OwnProps = {
  legacyEthAddr: string
} & ModalPropsType

type Props = OwnProps & ConnectedProps<typeof connector>

export default enhance(RecommendedImportSweepContainer)
