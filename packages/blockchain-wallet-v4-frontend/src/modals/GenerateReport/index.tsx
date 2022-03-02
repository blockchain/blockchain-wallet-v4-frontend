import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'

import GenerateReport from './template'

const GenerateReportContainer = ({ modalActions }) => {
  const onClose = () => modalActions.closeModal()

  return <GenerateReport onClose={onClose} />
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const enhance = compose(modalEnhancer('GENERATE_REPORT_MODAL'), connect(null, mapDispatchToProps))

export default enhance(GenerateReportContainer)
