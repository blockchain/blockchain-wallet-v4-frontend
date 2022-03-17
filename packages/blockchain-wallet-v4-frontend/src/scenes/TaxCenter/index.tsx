import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions, model, selectors } from 'data'
import { ModalName } from 'data/types'

import { getAddressesAndXpubs } from './selectors'
import TaxCenter from './template'

const { getLimits } = model.components.taxCenter

const TaxCenterContainer = ({
  addresses,
  errors,
  modalActions,
  options,
  reports,
  taxCenterActions
}) => {
  const [option, setOption] = useState(0)

  const handleClick = () => {
    const limits = getLimits(option)

    taxCenterActions.createReport({ ...addresses, ...limits })
    modalActions.showModal(ModalName.GENERATE_REPORT_MODAL)
  }

  const handleChange = (value) => setOption(value)

  useEffect(() => {
    taxCenterActions.getReports()
  }, [])

  return (
    <TaxCenter
      errors={errors}
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
  addresses: getAddressesAndXpubs(state),
  errors: selectors.components.taxCenter.selectErrors(state),
  options: selectors.components.taxCenter.selectOptions(),
  reports: selectors.components.taxCenter.selectReports(state)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(TaxCenterContainer)
