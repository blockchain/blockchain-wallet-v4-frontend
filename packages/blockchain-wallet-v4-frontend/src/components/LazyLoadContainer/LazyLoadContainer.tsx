import React, { ReactNode } from 'react'
import styled from 'styled-components'

// Wrapper is static size
const Wrapper = styled.div`
  height: 100%;
  overflow: auto;
  margin: 20px;
`
// Container resizes with children and scrolls inside wrapper
const Container = styled.div`
  width: 100%;
`

class LazyLoadContainer extends React.PureComponent<Props> {
  wrapper?: HTMLDivElement

  container?: HTMLDivElement

  setWrapperRef = (node) => {
    this.wrapper = node
  }

  setContainerRef = (node) => {
    this.container = node
  }

  onScroll = () => {
    if (!this.wrapper || !this.container) return
    const { onLazyLoad, triggerDistance } = this.props
    const wrapperRect = this.wrapper.getBoundingClientRect()
    const containerRect = this.container.getBoundingClientRect()

    if (this.props.useScroll) {
      const { scrollY } = window
      const clientHeight = window.innerHeight
      if (scrollY + clientHeight + triggerDistance > wrapperRect.height) {
        onLazyLoad()
      }
    } else if (wrapperRect.bottom + triggerDistance > containerRect.bottom) {
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
  useScroll?: boolean
}

export default LazyLoadContainer
