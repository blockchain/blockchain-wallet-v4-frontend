import styled from 'styled-components'

export const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 40px 40px 0 40px;
`

export const FinalStatusWrapper = styled(FieldsWrapper)`
  text-align: center;
  gap: 0.5rem;
  > span {
    justify-content: center;
  }
`

export const Entries = styled.div`
  background-color: ${(props) => props.theme.white};
  border-radius: 1rem;
  border: 1px solid ${(props) => props.theme.grey000};
`

export const Entry = styled.div`
  display: flex;
  padding: 1rem;
  align-items: center;

  > div {
    flex: 7;
  }

  div:last-child {
    flex: 5;
    text-align: right;
  }

  :not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.grey000};
  }
`
