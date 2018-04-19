import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { actions } from 'data'
import { isNil } from 'ramda'
import { getData } from './selectors'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

export class ChartContainer extends React.PureComponent {
  componentDidMount () {
    const cache = window.localStorage.getItem('ls.chart')
    const config = cache && JSON.parse(cache)
    const coin = config ? config.base.toUpperCase() : 'BTC'
    const time = config ? config.time : '1month'
    this.props.actions.initialized(coin, time)
  }

  render () {
    return this.props.data.cata({
      Success: (value) => {
        window.localStorage.setItem('ls.chart-data', JSON.stringify(value))
        window.localStorage.setItem('ls.chart', JSON.stringify({ base: value.coin, time: value.time }))
        return (<Success
          currency={value.currency}
          coin={value.coin}
          time={value.time}
          data={value.data}
        />)
      },
      Failure: (message) => {
        const cache = window.localStorage.getItem('ls.chart-data')
        const value = cache && JSON.parse(cache)
        return isNil(value)
          ? (<Error>{message}</Error>)
          : (<Success
            currency={value.currency}
            coin={value.coin}
            time={value.time}
            data={value.data}
          />)
      },
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.priceChart, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ChartContainer)
