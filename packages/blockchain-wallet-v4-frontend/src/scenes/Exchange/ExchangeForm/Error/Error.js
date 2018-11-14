import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { getErrorMessage } from '../validationMessages'

import { getData } from './selectors'
import { Row } from '../Layout'

const ErrorRow = styled(Row)`
  justify-content: center;
  min-height: 15px;
  padding: 0px;
`

class CurrencySelect extends React.PureComponent {
  render () {
    const { showError, txError, error } = this.props
    return (
      <ErrorRow>
        {((showError && error) || txError) &&
          getErrorMessage(txError || error)(this.props)}
      </ErrorRow>
    )
  }
}

export default connect(getData)(CurrencySelect)
