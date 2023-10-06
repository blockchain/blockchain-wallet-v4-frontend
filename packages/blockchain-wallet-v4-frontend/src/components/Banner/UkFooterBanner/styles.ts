import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.grey600};
  font-size: 0.75rem;
  background: ${({ theme }) => theme.grey000};
  text-align: center;
  padding: 0.5rem;
  position: sticky;
  bottom: 0;
`
