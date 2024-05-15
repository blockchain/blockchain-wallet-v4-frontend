import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.grey000};
  border-radius: 16px;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;
`

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`
