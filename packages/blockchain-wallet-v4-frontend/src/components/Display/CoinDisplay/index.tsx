import React from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class CoinDisplayContainer extends React.PureComponent<Props> {
  render() {
    const { data, ...rest } = this.props
    return data.cata({
      Success: value => <Success {...rest}>{value}</Success>,
      Failure: message => <Error {...rest}>{message}</Error>,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
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
