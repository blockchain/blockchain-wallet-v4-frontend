import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import TaxCenter from './template'

const TaxCenterContainer = ({ modalActions, reports }) => {
  const onGenerateReportClick = () => {
    modalActions.showModal('GENERATE_REPORT_MODAL')
  }
  return <TaxCenter reports={reports} onGenerateReportClick={onGenerateReportClick} />
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const mapStateToProps = () => ({
  reports: [{ id: 0 }]
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(TaxCenterContainer)
