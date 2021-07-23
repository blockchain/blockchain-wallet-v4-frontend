import React from 'react'
import styled from 'styled-components'

const Footer = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 40px;

  @media (max-width: 767px) {
    padding: 20px;
  }
`

const FlyoutFooter = (props: Props) => {
  return <Footer>{props.children}</Footer>
}

export type Props = {
  children?: React.ReactNode
}

export default React.memo(FlyoutFooter)
