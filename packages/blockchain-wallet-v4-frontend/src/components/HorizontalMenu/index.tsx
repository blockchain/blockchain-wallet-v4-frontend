import React from 'react'
import styled from 'styled-components'

import media from 'services/ResponsiveService'

const Wrapper = styled.div<{ border: boolean; marginBottom: string }>`
  box-sizing: border-box;
  background-color: ${props => props.theme.white};
  border-bottom: 1px solid
    ${props => (props.border ? props.theme['grey000'] : 'transparent')};
  margin-bottom: ${props => props.marginBottom};
  padding-bottom: 12px;
  width: 100%;

  ${media.tabletL`
    width: 100%;
    margin-left: 0px;
  `}
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  ${media.atLeastTabletL`
    flex-direction: row;
    justify-content: space-between;
  `}
`

const HorizontalMenu = ({
  border = true,
  marginBottom = '12px',
  children
}: {
  border?: boolean
  children: any
  marginBottom?: string
}) => (
  <Wrapper border={border} marginBottom={marginBottom}>
    <Container>{children}</Container>
  </Wrapper>
)

export default HorizontalMenu
