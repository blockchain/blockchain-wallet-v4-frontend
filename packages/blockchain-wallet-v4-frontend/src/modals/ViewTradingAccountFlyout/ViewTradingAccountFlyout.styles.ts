import styled from 'styled-components'

export const CloseIconContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${(props) => props.theme.grey000};
`
