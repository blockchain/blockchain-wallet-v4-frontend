import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100% - 115px);
  width: 100%;
  overflow: auto;
`
const Details = styled.details`
  white-space: pre-wrap;
  height: calc(75%);
  max-width: calc(75%);
  overflow: auto;
`

const ErrorBoundary = (props) => {
  const { error, errorInfo } = props

  return (
    <Wrapper>
      <h2>Something went terribly wrong.</h2>
      <Details>
        <summary>Show Stacktrace</summary>
        {error && error.toString()}
        <br />
        {errorInfo.componentStack}
      </Details>
    </Wrapper>
  )
}

export default ErrorBoundary
