import styled from 'styled-components'

const SecurityDescription = styled.div`
  padding: 10px 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.grey700};
  & > * {
    display: inline;
    margin-right: 5px;
  }
`

export default SecurityDescription
