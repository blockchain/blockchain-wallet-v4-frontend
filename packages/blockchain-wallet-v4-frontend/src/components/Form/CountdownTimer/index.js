import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import CountdownTimer from './template'

class CountdownTimerContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.interval = undefined
    const { expiryDate, createdDate } = this.props
    let startTime = createdDate || undefined
    this.state = {
      start: moment(startTime),
      expiration: moment(expiryDate),
      elapsed: moment.duration(moment(expiryDate).diff(moment(startTime)))
    }
    this.tick = this.tick.bind(this)
  }

  componentDidMount () {
    this.interval = setInterval(this.tick, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  tick () {
    const { handleExpiry } = this.props
    const elapsed = moment.duration(moment(this.state.expiration).diff(moment(this.state.start)))

    if (this.state.elapsed.as('seconds') < 1) {
      // If we reach the end of the timer, we execute the expiry callback
      if (handleExpiry) { handleExpiry() }
    } else {
      // We increment the time elapsed
      this.setState({ elapsed, start: moment(this.state.start).add(1, 'seconds') })
    }
  }

  render () {
    const timeLeft = moment.utc(this.state.elapsed.as('milliseconds')).format('mm:ss')

    return (
      <CountdownTimer {...this.props} timeLeft={timeLeft} />
    )
  }
}
CountdownTimerContainer.propTypes = {
  expiryDate: PropTypes.number,
  handleExpiry: PropTypes.func
}

CountdownTimerContainer.defaultProps = {
  expiryDate: moment().add(1, 'minutes')
}

export default CountdownTimerContainer
