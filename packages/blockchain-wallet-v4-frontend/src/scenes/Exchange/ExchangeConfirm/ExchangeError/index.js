import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Text } from 'blockchain-info-components'
import { selectors } from 'data'

import {
  ErrorMessageHeader,
  ErrorMessageBody,
  ErrorMessageButtons
} from './components'

const Error = styled.div`
  width: 100%;
  text-align: center;
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
        <CopyText>
          <ErrorMessageBody {...this.props} />
        </CopyText>
        <Buttons>
          <ErrorMessageButtons {...this.props} />
        </Buttons>
      </Error>
    )
  }
}

const mapStateToProps = state => ({
  min: selectors.components.exchange.getMin(state),
  max: selectors.components.exchange.getMax(state)
})

export default connect(mapStateToProps)(ExchangeError)
