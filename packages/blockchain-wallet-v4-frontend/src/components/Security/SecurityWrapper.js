import styled from 'styled-components'

const SecurityWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  @media(min-width: 992px) {
    align-items: flex-end;
  }

  & > * { margin-bottom: 10px; }
`

export default SecurityWrapper
