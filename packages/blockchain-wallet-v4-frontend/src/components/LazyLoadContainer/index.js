import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// Wrapper is static size
const Wrapper = styled.div`
  height: 100%;
  overflow: auto;
`
// Container resizes with children and scrolls inside wrapper
const Container = styled.div`
  width: 100%;
  height: 300px;
  overflow-y: scroll;
`

class LazyLoadContainer extends React.PureComponent {
  setWrapperRef = node => {
    this.wrapper = node
  }
  setContainerRef = node => {
    this.container = node
  }
  onScroll = () => {
    const { triggerDistance, onLazyLoad } = this.props
    const wrapperRect = this.wrapper.getBoundingClientRect()
    const containerRect = this.container.getBoundingClientRect()
    if (wrapperRect.bottom + triggerDistance > containerRect.bottom) {
      onLazyLoad()
    }
  }

  render () {
    const { children, className } = this.props
    return (
      <Wrapper
        className={className}
        onScroll={this.onScroll}
        innerRef={this.setWrapperRef}
      >
        <Container className='container' innerRef={this.setContainerRef}>
          {children}
        </Container>
      </Wrapper>
    )
  }
}

LazyLoadContainer.propTypes = {
  triggerDistance: PropTypes.number,
  onLazyLoad: PropTypes.func.isRequired
}

LazyLoadContainer.defaultProps = {
  triggerDistance: 200
}

export default LazyLoadContainer
