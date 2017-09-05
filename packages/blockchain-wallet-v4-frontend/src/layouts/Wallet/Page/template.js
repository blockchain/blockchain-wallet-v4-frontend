import React from 'react'
import styled from 'styled-components'

const PageContainer = styled.div`
  height: calc(100% - 115px);
  width: 100%;
  overflow-y: auto;
`

const Page = (props) => {
  const { handleScroll, children } = props
  return (
    <PageContainer onScroll={handleScroll}>
      {children}
    </PageContainer>
  )
}

export default Page
