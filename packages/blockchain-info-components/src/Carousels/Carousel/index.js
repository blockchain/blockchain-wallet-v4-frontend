import React from 'react'
import PropTypes from 'prop-types'
import CarouselTemplate from './template.js'

class Carousel extends React.Component {
  constructor (props) {
    super(props)
    this.state = { index: 0, total: props.children.length - 1 }
    this.handleClick = this.handleClick.bind(this)
    this.interval = undefined
  }

  componentWillMount () {
    const { auto, delay } = this.props
    if (auto) {
      this.interval = setInterval(() => {
        const nextIndex = this.state.index === this.state.total ? 0 : this.state.index + 1
        this.setState({ index: nextIndex })
      }, delay)
    }
  }

  componentWillUnmount () {
    if (this.interval) { clearInterval(this.interval) }
  }

  handleClick (index) {
    this.setState({ index })
  }

  render () {
    const { children, ...rest } = this.props

    return (
      <CarouselTemplate index={this.state.index} total={this.state.total} handleClick={this.handleClick} {...rest}>
        {children}
      </CarouselTemplate>
    )
  }
}

Carousel.propTypes = {
  auto: PropTypes.bool,
  delay: PropTypes.number,
  height: PropTypes.number
}

Carousel.defaultProps = {
  auto: false,
  delay: 3000,
  height: 150
}

export default Carousel
