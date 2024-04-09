import styled from 'styled-components'

export const MainWrapper = styled.div<{
  expanded: boolean
}>`
  margin: 20px 0 30px 0;
  display: flex;
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.grey100};
  border-radius: 16px;

  overflow: hidden;
  transition: max-height 0.3s ease;
  max-height: ${({ expanded }) => (expanded ? '800px' : '50px')};
`

export const ContentWrapper = styled.div`
  display: flex;
  padding: 16px;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid ${(props) => props.theme.grey100};

  &:last-child {
    border-bottom: none;
  }
`

export const Title = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.grey100};
`

export const Arrow = styled.div`
  cursor: pointer;
  transition: transform 0.3s ease;
`
