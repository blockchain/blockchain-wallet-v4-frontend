import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import { Analytics, ModalName } from 'data/types'
import { useRemote } from 'hooks'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import { getData } from './selectors'
import RecommendedImportedSweep from './template'
import Error from './template.error'
import NoActionRequired from './template.noaction'

const RecommendedImportSweepContainer = (props: Props) => {
  const { cacheActions, sendBchActions, sendBtcActions } = props
  const { data, error, isLoading, isNotAsked } = useRemote(getData)
  const {
    data: btcSweep,
    error: btcError,
    isLoading: btcLoading
  } = useRemote(selectors.components.sendBtc.getBtcImportedFundsSweep)
  const {
    data: bchSweep,
    error: bchError,
    isLoading: bchLoading
  } = useRemote(selectors.components.sendBch.getBchImportedFundsSweep)

  const {
    data: btcAddressHasBalance,
    error: btcAddressHasBalanceError,
    isLoading: btcAddressHasBalanceLoading
  } = useRemote(selectors.components.sendBtc.getBtcImportedFundsWithEffectiveBalance)

  const DUST = 546

  const bchAddressHasBalance = data?.bchImports.filter((addr) => addr.info.final_balance > DUST)
  const sweepSuccess = props.btcSweepSuccess && props.bchSweepSuccess

  const handleSubmit = () => {
    sendBtcActions.btcImportedFundsSweep(btcAddressHasBalance!.map((item) => item.address))

    sendBchActions.bchImportedFundsSweep(bchAddressHasBalance!.map((item) => item.addr))
    props.analyticsActions.trackEvent({
      key: Analytics.TRANSFER_FUNDS_CLICKED,
      properties: {}
    })
  }

  if (isNotAsked || error) return null
  if (
    props.hideNoActionRequiredSweep?.guid === props.walletGuid &&
    props.hideNoActionRequiredSweep?.seen &&
    btcAddressHasBalance?.length === 0 &&
    bchAddressHasBalance?.length === 0
  )
    return null

  if (btcAddressHasBalance?.length === 0 && bchAddressHasBalance?.length === 0) {
    return <NoActionRequired {...props} />
  }
  if (btcError || bchError) {
    return <Error handleSubmit={handleSubmit} {...props} />
  }

  return (
    <RecommendedImportedSweep
      {...props}
      btcAddressHasBalance={btcAddressHasBalance}
      btcLoading={btcLoading}
      bchAddressHasBalance={bchAddressHasBalance}
      bchLoading={bchLoading}
      handleSubmit={handleSubmit}
      sweepSuccess={sweepSuccess}
    />
  )
}

const mapStateToProps = (state) => ({
  bchSweepSuccess: selectors.components.sendBch.getBchImportedFundsSweep(state).getOrElse(false),
  btcSweepSuccess: selectors.components.sendBtc.getBtcImportedFundsSweep(state).getOrElse(false),
  hideNoActionRequiredSweep: selectors.cache.getNoActionRequiredSweep(state),
  walletGuid: selectors.core.wallet.getGuid(state)
})

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  cacheActions: bindActionCreators(actions.cache, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  sendBchActions: bindActionCreators(actions.components.sendBch, dispatch),
  sendBtcActions: bindActionCreators(actions.components.sendBtc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(modalEnhancer(ModalName.RECOMMENDED_IMPORTED_SWEEP), connector)

export type Props = ModalPropsType & ConnectedProps<typeof connector>

export default enhance(RecommendedImportSweepContainer)
