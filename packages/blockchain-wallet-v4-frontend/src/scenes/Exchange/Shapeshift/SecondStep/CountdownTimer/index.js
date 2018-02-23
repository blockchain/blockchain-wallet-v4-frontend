import React from 'react'
import moment from 'moment'
import CountdownTimer from './template'

class CountdownTimerContainer extends React.Component {
  constructor (props) {
    super(props)
    this.interval = undefined
    this.state = { initial: moment().add(10, 'minutes'), elapsed: moment.duration(600000) }
    this.tick = this.tick.bind(this)
  }

  componentDidMount () {
    this.interval = setInterval(this.tick, 1000)
  }

  tick () {
    const elapsed = moment.duration(this.state.initial.diff(moment()))
    this.setState({ elapsed })
    // const { initial, current } = this.state
    // if (current.subtract(initial).get('minute') >= 10) { clearInterval(this.interval) }
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  render () {
    const timeLeft = moment.utc(this.state.elapsed.as('milliseconds')).format('mm:ss')

    return <CountdownTimer timeLeft={timeLeft} />
  }
}

export default CountdownTimerContainer
