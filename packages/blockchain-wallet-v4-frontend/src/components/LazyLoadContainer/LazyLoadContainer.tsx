import React, { ReactNode } from 'react'
import styled from 'styled-components'

// Wrapper is static size
const Wrapper = styled.div`
  height: 100%;
  overflow: auto;
`
// Container resizes with children and scrolls inside wrapper
const Container = styled.div`
  width: 100%;
`

class LazyLoadContainer extends React.PureComponent<Props> {
  wrapper: ReactNode

  container: ReactNode

  setWrapperRef = (node) => {
    this.wrapper = node
  }

  setContainerRef = (node) => {
    this.container = node
  }

  onScroll = () => {
    const { onLazyLoad, triggerDistance } = this.props
    // @ts-ignore
    const wrapperRect = this.wrapper.getBoundingClientRect()
    // @ts-ignore
    const containerRect = this.container.getBoundingClientRect()
    if (wrapperRect.bottom + triggerDistance > containerRect.bottom) {
      onLazyLoad()
    }
  }

  render() {
    const { children, className } = this.props
    return (
      <Wrapper
        className={className}
        onWheel={this.onScroll}
        onScroll={this.onScroll}
        ref={this.setWrapperRef}
      >
        <Container className='container' ref={this.setContainerRef}>
          {children}
        </Container>
      </Wrapper>
    )
  }
}

type Props = {
  className?: string
  onLazyLoad: () => void
  triggerDistance: number
}

export default LazyLoadContainer
