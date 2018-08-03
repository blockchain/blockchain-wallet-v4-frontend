import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;

  @media (min-width: 850px) {
    align-items: flex-end;
  }
`

export const Header = styled.div`
  margin-bottom: 10px;
`

export const CoinBalanceWrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding-right: ${props => (props.large ? '15px' : '0px')};
  > div:last-child {
    margin-left: 10px;
    > div {
      color: ${props => props.theme['gray-3']};
    }
  }
`
