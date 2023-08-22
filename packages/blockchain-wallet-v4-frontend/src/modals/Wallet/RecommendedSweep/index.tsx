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
    // props.sendBtcActions.btcImportedFundsSweep()
    props.sendBchActions.bchImportedFundsSweep()
    // props.modalActions.closeModal(ModalName.RECOMMENDED_IMPORTED_SWEEP)
  }
  const btcAddressHasBalance = data?.btcImports.filter((addr) => addr.info.final_balance > 0)
  const bchAddressHasBalance = data?.bchImports.filter((addr) => addr.info.final_balance > 0)

  if (isLoading || isNotAsked || error) return null
  if (data?.bchImports.length === 0 && data?.btcImports.length === 0) return null

  return (
    <RecommendedImportedSweep
      {...props}
      btcAddressHasBalance={btcAddressHasBalance}
      bchAddressHasBalance={bchAddressHasBalance}
      bchImportedAddresses={data?.bchImports}
      btcImportedAddresses={data?.btcImports}
      onSubmit={handleSubmit}
    />
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  sendBchActions: bindActionCreators(actions.components.sendBch, dispatch),
  sendBtcActions: bindActionCreators(actions.components.sendBtc, dispatch),
  sendCryptoActions: bindActionCreators(actions.components.sendCrypto, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(modalEnhancer(ModalName.RECOMMENDED_IMPORTED_SWEEP), connector)

type Props = ModalPropsType & ConnectedProps<typeof connector>

export default enhance(RecommendedImportSweepContainer)
