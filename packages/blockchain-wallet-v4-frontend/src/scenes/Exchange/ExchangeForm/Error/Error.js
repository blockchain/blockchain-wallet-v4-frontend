import { connect } from 'react-redux'
import { getData } from './selectors'
import { getErrorMessage } from './validationMessages'
import { Row } from '../Layout'
import React from 'react'
import styled from 'styled-components'

const ErrorRow = styled(Row)`
  justify-content: center;
  min-height: 16px;
  padding: 0;
`

export class Error extends React.PureComponent {
  render () {
    const { showError, txError, error } = this.props
    const ErrorMessage = getErrorMessage(txError || error)
    return (
      <ErrorRow data-e2e='exchangeErrorMessage'>
        {((showError && error) || txError) && <ErrorMessage {...this.props} />}
      </ErrorRow>
    )
  }
}

export default connect(getData)(Error)
