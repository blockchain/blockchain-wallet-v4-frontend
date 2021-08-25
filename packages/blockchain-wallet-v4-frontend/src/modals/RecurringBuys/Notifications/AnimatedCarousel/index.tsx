import React from 'react'

import CarouselTemplate from './template'

type Props = {
  auto?: boolean
  delay?: number
  stepChange: (number) => void
}

type State = {
  index: number
  total: number
}

class AnimatedCarousel extends React.PureComponent<Props, State> {
  private interval: NodeJS.Timeout | undefined

  constructor(props) {
    super(props)
    this.state = { index: 0, total: props.children.length - 1 }
    this.interval = undefined
  }

  componentDidMount() {
    const { auto, delay } = this.props
    if (auto) {
      this.interval = setInterval(() => this.setState({ index: this.getNextIndex() }), delay)
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  handleClick = (index: number) => {
    this.setState({ index })
  }

  handlePrevious = () => {
    const index = this.getPreviousIndex()
    this.props.stepChange(index)
    this.setState({ index })
  }

  handleNext = () => {
    const index = this.getNextIndex()
    this.props.stepChange(index)
    this.setState({ index })
  }

  getPreviousIndex = () => {
    const { index, total } = this.state
    return index === 0 ? total : index - 1
  }

  getNextIndex = () => {
    const { index, total } = this.state
    return index === total ? 0 : index + 1
  }

  render() {
    return (
      <CarouselTemplate
        index={this.state.index}
        total={this.state.total}
        handleClick={this.handleClick}
        handlePrevious={this.handlePrevious}
        handleNext={this.handleNext}
      >
        {this.props.children}
      </CarouselTemplate>
    )
  }
}

export default AnimatedCarousel
