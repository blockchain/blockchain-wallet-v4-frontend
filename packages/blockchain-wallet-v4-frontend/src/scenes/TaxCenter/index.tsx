import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import TaxCenter from './template'

const TaxCenterContainer = ({ modalActions }) => {
  const onGenerateReportClick = () => {
    modalActions.showModal('GENERATE_REPORT_MODAL')
  }
  return <TaxCenter onGenerateReportClick={onGenerateReportClick} />
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(null, mapDispatchToProps)

export default connector(TaxCenterContainer)
