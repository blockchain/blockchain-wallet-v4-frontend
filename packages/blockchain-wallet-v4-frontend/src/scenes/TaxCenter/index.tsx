import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'
import { Analytics, ModalName } from 'data/types'

import { getFirstAndLastDaysOfYear } from './model'
import { getAddressesAndXpubs, getExchangeDomain, getReportYearOptions } from './selectors'
import TaxCenter from './template'

const TaxCenterContainer = ({
  analyticsActions,
  exchangeDomain,
  modalActions,
  options,
  reportsR,
  taxCenterActions,
  walletDataR
}) => {
  const [option, setOption] = useState(0)

  const handleClick = () => {
    const limits = getFirstAndLastDaysOfYear(option)

    taxCenterActions.createReport({ walletData: walletDataR, ...limits })
    modalActions.showModal(ModalName.GENERATE_REPORT_MODAL)

    analyticsActions.trackEvent({
      key: Analytics.TAX_CENTER_REPORT_EXPORT_CLICKED,
      properties: {
        origin: 'SETTINGS',
        time_period: !option ? 'ALL_TIME' : String(option)
      }
    })
  }

  const handleChange = (value) => setOption(value)

  const handlePartnerClick = (partner: string) => {
    analyticsActions.trackEvent({
      key: Analytics.TAX_CENTER_PARTNER_CLICKED,
      properties: { partner }
    })
  }

  const handleExportClick = (timePeriod) => {
    analyticsActions.trackEvent({
      key: Analytics.TAX_CENTER_REPORT_CLICKED,
      properties: {
        origin: 'SETTINGS',
        time_period: !timePeriod ? 'ALL_TIME' : String(timePeriod)
      }
    })
  }

  const handleVisitClick = () => {
    analyticsActions.trackEvent({
      key: Analytics.TAX_CENTER_LINK_EXCHANGE_CLICKED,
      properties: {
        origin: 'WALLET_TAX_CENTER'
      }
    })
  }

  useEffect(() => {
    const { href, pathname, search } = window.location
    const { referrer, title } = document

    analyticsActions.trackEvent({
      key: Analytics.TAX_CENTER_VIEWED,
      properties: {
        path: pathname,
        referrer,
        search,
        title,
        url: href
      }
    })

    taxCenterActions.getReports()
  }, [])

  useEffect(() => {
    const list = reportsR.getOrElse([])

    if (list && list.some((item) => item.status === 'PENDING')) {
      taxCenterActions.getReports()
    }
  }, [taxCenterActions, reportsR])

  return (
    <TaxCenter
      exchangeDomain={exchangeDomain}
      onPartnerClick={handlePartnerClick}
      value={option}
      onChange={handleChange}
      options={options}
      reportsR={reportsR}
      onClick={handleClick}
      onExportClick={handleExportClick}
      onVisitClick={handleVisitClick}
    />
  )
}

const mapDispatchToProps = (dispatch) => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  taxCenterActions: bindActionCreators(actions.components.taxCenter, dispatch)
})

const mapStateToProps = (state) => ({
  exchangeDomain: getExchangeDomain(state),
  options: getReportYearOptions(),
  reportsR: selectors.components.taxCenter.selectReports(state),
  walletDataR: getAddressesAndXpubs(state)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(TaxCenterContainer)
