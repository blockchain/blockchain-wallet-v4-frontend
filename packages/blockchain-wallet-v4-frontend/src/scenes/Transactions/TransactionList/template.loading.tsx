import React from 'react'
import styled from 'styled-components'

import { StandardRow } from 'components/Rows'

const LoadingWrapper = styled.div`
  width: 100%;
`
const Loading = () => (
  <LoadingWrapper>
    <StandardRow loading />
    <StandardRow loading />
    <StandardRow loading />
  </LoadingWrapper>
)

export default Loading
