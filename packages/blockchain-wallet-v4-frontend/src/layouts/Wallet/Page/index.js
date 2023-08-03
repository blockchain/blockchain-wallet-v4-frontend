import React, { useRef } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: ${({ center = false }) => (center ? 'center' : 'flex-start')};
  align-items: flex-start;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  > div {
    box-sizing: border-box;
  }
`

const PageContainer = ({ center, children }) => {
  const ref = useRef('page')
  return (
    <Wrapper ref={ref} center={center}>
      {children}
    </Wrapper>
  )
}

export default PageContainer
