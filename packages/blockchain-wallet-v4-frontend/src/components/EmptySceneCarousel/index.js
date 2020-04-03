import CarouselTemplate from './template.js'
import PropTypes from 'prop-types'
import React from 'react'

class EmptySceneCarousel extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { index: 0, total: props.children.length - 1 }
    this.handleClick = this.handleClick.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.handleNext = this.handleNext.bind(this)
  }

  getPreviousIndex () {
    const { index, total } = this.state
    return index === 0 ? total : index - 1
  }

  getNextIndex () {
    const { index, total } = this.state
    return index === total ? 0 : index + 1
  }

  handleClick (index) {
    this.setState({ index })
  }

  handlePrevious () {
    this.setState({ index: this.getPreviousIndex() })
  }

  handleNext () {
    this.setState({ index: this.getNextIndex() })
  }

  render () {
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

EmptySceneCarousel.propTypes = {
  height: PropTypes.number
}

EmptySceneCarousel.defaultProps = {
  height: 150
}

export default EmptySceneCarousel
