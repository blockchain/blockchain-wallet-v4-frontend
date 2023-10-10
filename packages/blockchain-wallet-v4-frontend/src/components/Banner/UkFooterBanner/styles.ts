import styled from 'styled-components'

export const Container = styled.div<{ isSticky?: boolean }>`
  display: flex;
  width: 100%;
  position: sticky;
  bottom: 0;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.grey600};
  font-size: 0.75rem;
  background: ${({ theme }) => theme.grey000};
  text-align: center;
  padding: 0.5rem;
`
