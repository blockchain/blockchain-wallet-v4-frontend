import React from 'react'

class CountdownTimer extends React.Component {
  constructor (props) {
    super(props)
    this.tick = this.tick.bind(this)
  }

  componentDidMount () {
    this.setState({ time: this.props.timeLeft })
    this.interval = setInterval(this.tick, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  tick () {
    this.setState({ time: this.state.time - 1000 })
    if (this.state.time <= 0) {
      clearInterval(this.interval)
    }
  }

  render () {
    const time = this.state && new Date(this.state.time)
    return (
      <div>
        {time
          ? `${time.getMinutes()} : ${time.getSeconds()}`
          : 'N/A'
        }
      </div>
    )
  }
}

export default CountdownTimer
