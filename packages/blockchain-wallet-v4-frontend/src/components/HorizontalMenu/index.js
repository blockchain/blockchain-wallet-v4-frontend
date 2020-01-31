import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: 100%;
  padding: 8px 0px;
  box-sizing: border-box;
  background-color: ${props => props.theme.white};
  border-bottom: 1px solid ${props => props.theme['gray-1']};

  @media (max-width: 991px) {
    width: 100%;
    margin-left: 0px;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
  }
`

const HorizontalMenu = ({ children }) => (
  <Wrapper>
    <Container>{children}</Container>
  </Wrapper>
)

export default HorizontalMenu
