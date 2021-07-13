import React from 'react'
import PropTypes from 'prop-types'

import CarouselTemplate from './template.js'

class Carousel extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = { index: 0, total: props.children.length - 1 }
    this.handleClick = this.handleClick.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.handleNext = this.handleNext.bind(this)
    this.interval = undefined
  }

  componentDidMount() {
    const { auto, delay } = this.props
    if (auto) {
      this.interval = setInterval(
        () => this.setState({ index: this.getNextIndex() }),
        delay
      )
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  getPreviousIndex() {
    const { index, total } = this.state
    return index === 0 ? total : index - 1
  }

  getNextIndex() {
    const { index, total } = this.state
    return index === total ? 0 : index + 1
  }

  handleClick(index) {
    this.setState({ index })
  }

  handlePrevious() {
    this.setState({ index: this.getPreviousIndex() })
  }

  handleNext() {
    this.setState({ index: this.getNextIndex() })
  }

  render() {
    const { children, ...rest } = this.props

    return (
      <CarouselTemplate
        index={this.state.index}
        total={this.state.total}
        handleClick={this.handleClick}
        handlePrevious={this.handlePrevious}
        handleNext={this.handleNext}
        {...rest}
      >
        {children}
      </CarouselTemplate>
    )
  }
}

Carousel.propTypes = {
  auto: PropTypes.bool,
  delay: PropTypes.number,
  height: PropTypes.number,
  arrows: PropTypes.bool,
  chips: PropTypes.bool,
  nextButton: PropTypes.bool
}

Carousel.defaultProps = {
  auto: false,
  delay: 3000,
  height: 150,
  arrows: true,
  chips: true,
  nextButton: true
}

export default Carousel
