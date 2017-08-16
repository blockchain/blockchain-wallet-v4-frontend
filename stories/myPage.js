import React from 'react'
import styled from 'styled-components'

const BasePage = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 200px;
`
const Page = props => <BasePage>{props.children}</BasePage>
export default Page
