import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import TaxCenter from './template'

const TaxCenterContainer = ({ modalActions, options, reports, taxCenterActions }) => {
  const onGenerateReportClick = () => {
    // taxCenterActions
    modalActions.showModal('GENERATE_REPORT_MODAL')
  }

  useEffect(() => {
    taxCenterActions.getReports()
  }, [])

  return (
    <TaxCenter options={options} reports={reports} onGenerateReportClick={onGenerateReportClick} />
  )
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  taxCenterActions: bindActionCreators(actions.components.taxCenter, dispatch)
})

const mapStateToProps = (state) => ({
  options: selectors.components.taxCenter.selectOptions(),
  reports: selectors.components.taxCenter.selectReports(state)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(TaxCenterContainer)
