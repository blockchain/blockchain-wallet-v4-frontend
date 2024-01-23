import styled from 'styled-components'

export const ItemButton = styled.button<{ isComplete?: boolean; status: string }>`
  border: 1px solid ${(props) => props.theme.grey100};
  box-sizing: border-box;
  border-radius: 12px;
  padding: 16px 24px;
  margin-bottom: 16px;
  cursor: ${(props) => (props.status === 'IDLE' ? 'pointer' : 'cursor')};
  background-color: ${(props) => (props.status === 'DISABLED' ? props.theme.grey100 : 'inherit')};
`

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
`

export const IconWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  img {
    max-width: 24px;
    align-self: center;
  }
`

export const MainSection = styled.div`
  display: flex;
  margin-left: 1rem;
  margin-right: 1rem;
  min-height: 36px;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`
export const CentralContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const ActionButton = styled.div`
  display: flex;
  flex-direction: row;
`
