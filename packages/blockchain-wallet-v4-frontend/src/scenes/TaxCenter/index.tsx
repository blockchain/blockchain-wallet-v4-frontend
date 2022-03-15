import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import TaxCenter from './template'
import { getLimits } from './utils'

const TaxCenterContainer = ({ addresses, modalActions, options, reports, taxCenterActions }) => {
  const [option, setOption] = useState(0)

  const handleClick = () => {
    const limits = getLimits(option)

    taxCenterActions.createReport({ ...addresses, ...limits })
    modalActions.showModal('GENERATE_REPORT_MODAL')
  }

  const handleChange = (value) => setOption(value)

  useEffect(() => {
    taxCenterActions.getReports()
  }, [])

  return (
    <TaxCenter
      value={option}
      onChange={handleChange}
      options={options}
      reports={reports}
      onClick={handleClick}
    />
  )
}

const mapDispatchToProps = (dispatch) => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  taxCenterActions: bindActionCreators(actions.components.taxCenter, dispatch)
})

const mapStateToProps = (state) => ({
  addresses: selectors.components.taxCenter.selectAddress(state),
  options: selectors.components.taxCenter.selectOptions(),
  reports: selectors.components.taxCenter.selectReports(state)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(TaxCenterContainer)
