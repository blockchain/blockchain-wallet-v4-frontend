import styled from 'styled-components'

export const CloseIcon = styled.div`
  > :first-child {
    cursor: pointer;
  }
`

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`

export const SlippageButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;

  > button {
    width: calc(25% - 8px);
    min-width: calc(25% - 8px);
    max-width: calc(25% - 8px);

    &.active {
      color: ${(props) => props.theme.white};
      background-color: ${(props) => props.theme.grey800};
      border: 1px solid ${(props) => props.theme.grey800};
      cursor: default;
    }
  }
`
