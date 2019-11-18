import React from 'react'
import styled from 'styled-components'

import About from './About'
import PrivacyPolicy from './PrivacyPolicy'
import TermsOfService from './TermsOfService'

const Wrapper = styled.section`
  padding: 30px;
  width: 100%;
  box-sizing: border-box;
`

const General = () => {
  return (
    <Wrapper>
      <PrivacyPolicy />
      <TermsOfService />
      <About />
    </Wrapper>
  )
}

export default General
