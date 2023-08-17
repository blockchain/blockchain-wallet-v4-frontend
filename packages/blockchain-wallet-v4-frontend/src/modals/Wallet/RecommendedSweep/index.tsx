import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import { SendCryptoStepType } from 'data/components/sendCrypto/types'
import { ModalName } from 'data/types'
import { useRemote } from 'hooks'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import { getData } from './selectors'
import RecommendedImportedSweep from './template'

const RecommendedImportSweepContainer = (props: Props) => {
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const SEND_FORM = '@SEND_CRYPTO'
  const handleSubmit = () => {
    props.modalActions.showModal(ModalName.SEND_BTC_MODAL, {
      amount: '1',
      from: 'sweepImportedAddresses',
      origin: 'RecommendedImportedSweep'
    })
  }

  if (isLoading || isNotAsked || error) return null
  return <RecommendedImportedSweep {...props} onSubmit={handleSubmit} />
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  sendBtcActions: bindActionCreators(actions.components.sendBtc, dispatch),
  sendCryptoActions: bindActionCreators(actions.components.sendCrypto, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(modalEnhancer(ModalName.RECOMMENDED_IMPORTED_SWEEP), connector)

type Props = ModalPropsType & ConnectedProps<typeof connector>

export default enhance(RecommendedImportSweepContainer)
