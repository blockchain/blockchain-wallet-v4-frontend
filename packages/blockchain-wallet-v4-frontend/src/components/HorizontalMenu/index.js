import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  @media(min-width: 1200px) {
    flex-direction: row;
    justify-content: space-between;
  }
`
const Status = styled.div`
  width: 100%;
  @media(min-width: 1200px) { width: 360px; }
`

const HorizontalMenu = ({ children }) => (
  <Wrapper>
    <Container>
      <Status>
        {children}
      </Status>
    </Container>
  </Wrapper>
)

export default HorizontalMenu
