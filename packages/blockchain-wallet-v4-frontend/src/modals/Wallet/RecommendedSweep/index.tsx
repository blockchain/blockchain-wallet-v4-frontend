import React, { useEffect } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions, selectors } from 'data'
import { Analytics, ModalName } from 'data/types'
import { useRemote } from 'hooks'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../../types'
import { getData } from './selectors'
import RecommendedImportedSweep from './template'
import NoActionRequired from './template.noaction'

const RecommendedImportSweepContainer = (props: Props) => {
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

  const DUST = 546

  const btcAddressHasBalance = data?.btcImports.filter((addr) => addr.info.final_balance > DUST)
  const bchAddressHasBalance = data?.bchImports.filter((addr) => addr.info.final_balance > DUST)

  const handleSubmit = () => {
    props.sendBtcActions.btcImportedFundsSweep(btcAddressHasBalance!.map((item) => item.addr))

    // props.sendBchActions.bchImportedFundsSweep(bchAddressHasBalance!.map((item) => item.addr))
    props.analyticsActions.trackEvent({
      key: Analytics.TRANSFER_FUNDS_CLICKED,
      properties: {}
    })
  }
  if (isLoading || isNotAsked || error) return null
  if (
    props.hideNoActionRequiredSweep?.guid === props.walletGuid &&
    props.hideNoActionRequiredSweep?.seen
  )
    return null
  if (
    (data?.bchImports.length === 0 && data?.btcImports.length === 0) ||
    (btcAddressHasBalance?.length === 0 && bchAddressHasBalance?.length === 0)
  ) {
    return <NoActionRequired {...props} />
  }

  return (
    <RecommendedImportedSweep
      {...props}
      btcAddressHasBalance={btcAddressHasBalance}
      btcLoading={btcLoading}
      bchAddressHasBalance={bchAddressHasBalance}
      bchLoading={bchLoading}
      onSubmit={handleSubmit}
    />
  )
}

const mapStateToProps = (state) => ({
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
