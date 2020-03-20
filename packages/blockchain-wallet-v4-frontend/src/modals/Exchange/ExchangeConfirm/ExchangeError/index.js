import { actions } from 'data'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import {
  ErrorMessageBody,
  ErrorMessageButtons,
  ErrorMessageHeader
} from './components'

const Error = styled.div`
  width: 100%;
  text-align: center;
  margin-top: -8px;
`
const HeaderText = styled(Text).attrs({
  size: '18px'
})``
const CopyText = styled(Text).attrs({
  weight: 300,
  size: '14px'
})`
  margin: 8px 0 16px 0;
`
const Buttons = styled.div`
  > button {
    width: 100%;
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
`

class ExchangeError extends React.PureComponent {
  render () {
    return (
      <Error>
        <HeaderText>
          <ErrorMessageHeader {...this.props} />
        </HeaderText>
        <CopyText data-e2e='swapErrorMessage'>
          <ErrorMessageBody {...this.props} {...this.props.data} />
        </CopyText>
        <Buttons>
          <ErrorMessageButtons {...this.props} />
        </Buttons>
      </Error>
    )
  }
}

const mapStateToProps = state => ({
  ...getData(state)
})

const mapDispatchToProps = dispatch => ({
  verifyIdentity: () =>
    dispatch(actions.components.identityVerification.verifyIdentity())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeError)
