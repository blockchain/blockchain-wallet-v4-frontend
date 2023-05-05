import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 24px 16px;
`

export const GasFeeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 20px;
  padding: 4px 8px;
  margin-right: 8px;

  border-radius: 4px;
  background-color: ${(props) => props.theme.grey000};

  > :first-child {
    margin-right: 6px;
  }
`

export const ShowDetailsWrapper = styled.div`
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
  }
`

export const HorizontalLine = styled.div`
  width: 24px;
  height: 1px;
  background-color: ${(props) => props.theme.grey900};
`
