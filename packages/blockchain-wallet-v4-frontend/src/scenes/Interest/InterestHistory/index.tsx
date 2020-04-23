// import { actions } from 'data'
// import { bindActionCreators, Dispatch } from 'redux'
// import { connect, ConnectedProps } from 'react-redux'

// import {
//   NabuApiErrorType,
//   RemoteDataType,
//   SupportedCoinsType
// } from 'core/types'
// import { RatesType, UserDataType } from 'data/types'
import React, { Component } from 'react'
import styled from 'styled-components'
import Success from './template.success'

const History = styled.div`
  margin-top: 48px;
  max-width: 1200px;
`

class InterestHistory extends Component {
  state = {}

  render() {
    return (
      <History>
        <Success />
      </History>
    )
  }
}

export default InterestHistory
