import React from 'react'
import styled from 'styled-components'

const FlexContainer = styled.div`
  display: flex;
  justify-items: center;
  justify-content: center;
  width: 100%;
  padding: 72px 0;
`

export const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  // we need that div here because somewhere from the top level div:first-child styles are set
  <div>
    <FlexContainer>{children}</FlexContainer>
  </div>
)
