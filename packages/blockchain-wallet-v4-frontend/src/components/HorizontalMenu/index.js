import React from 'react'
import styled from 'styled-components'
import Media from 'services/ResponsiveService'

const Wrapper = styled.div`
  width: 100%;
  padding: 8px 30px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white-blue']};
  border-bottom: 1px solid ${props => props.theme['gray-1']};
`
const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;

  ${Media.tablet`
    flex-direction: column;
    justify-content: flex-start;
  `};
`

const HorizontalMenu = ({ children }) => (
  <Wrapper>
    <Container>{children}</Container>
  </Wrapper>
)

export default HorizontalMenu
