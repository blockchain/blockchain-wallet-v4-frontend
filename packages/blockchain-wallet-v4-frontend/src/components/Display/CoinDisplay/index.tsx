import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { getData } from './selectors'
import Success from './template.success'

class CoinDisplayContainer extends React.PureComponent<Props> {
  render() {
    const { data, ...rest } = this.props
    return <Success {...rest}>{data}</Success>
  }
}

// @ts-ignore
CoinDisplayContainer.defaultProps = {
  children: 0
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(ownProps.coin, ownProps.children, ownProps.hideCoinTicker)
})

const connector = connect(mapStateToProps)

type Props = ConnectedProps<typeof connector>

export default connector(CoinDisplayContainer)
