import styled from 'styled-components'

const Text = styled.div`
  font-size: ${props => props.size};
  font-weight: ${props => props.weight};
  text-transform: ${props => props.transform};
`

export default Text
