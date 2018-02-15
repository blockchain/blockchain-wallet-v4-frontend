import React from 'react'
import styled from 'styled-components'
import { isEmpty } from 'ramda'

import Empty from './Empty'
import Pages from './Pages'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`

const Success = props => (
  <Wrapper>
    {
      !isEmpty(props.pages)
        ? props.pages.map((value, index) => <Pages key={index} data={value} />)
        : <Empty />
    }
  </Wrapper>
)

export default Success
