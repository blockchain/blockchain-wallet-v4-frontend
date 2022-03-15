import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { bindActionCreators } from 'redux'

import { actions, selectors } from 'data'

import TaxCenter from './template'

const FIRST_YEAR = 2014

const getLimits = (option) => {
  if (option === 0) {
    return {
      from: moment().year(FIRST_YEAR).startOf('year').toISOString(),
      to: moment().subtract(1, 'days').toISOString()
    }
  }

  return {
    from: moment().year(option).startOf('year').toISOString(),
    to: moment().year(option).endOf('year').toISOString()
  }
}

const TaxCenterContainer = ({ addresses, modalActions, options, reports, taxCenterActions }) => {
  const [option, setOption] = useState(0)

  const onGenerateReportClick = () => {
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
      handleChange={handleChange}
      options={options}
      reports={reports}
      onGenerateReportClick={onGenerateReportClick}
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
