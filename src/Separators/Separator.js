import React from 'react'
import styled from 'styled-components'

const BaseSeparator = styled.div`
  border-bottom: 1px solid ${props => props.theme['gray-2']};
  margin: 10px 0;
`

const Separator = props => <BaseSeparator />
export default Separator
