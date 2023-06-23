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

export const InputContainer = styled.div`
  display: flex;
  position: relative;
  margin-top: 8px;

  & > img {
    position: absolute;
    top: 10px;
    right: 12px;
  }
`

export const ButtonSection = styled(Section)`
  & > button {
    border-radius: 32px !important;
  }
`

export const CustomInput = styled.input`
  flex-grow: 1;
  border-style: none;
  padding-left: 16px;
  outline: 2px solid transparent;
  outline-offset: 2px;
  height: 100%;
  background-color: ${({ theme }) => theme.grey000};
  padding: 12px 48px 12px 16px;
  font-size: 16px;
  border-radius: 8px;
`
