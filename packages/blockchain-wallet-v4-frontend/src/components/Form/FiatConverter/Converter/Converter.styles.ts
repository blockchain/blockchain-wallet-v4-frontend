import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const Wrapper = styled.div<{ showError?: boolean }>`
  width: 100%;
  height: 40px;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin-bottom: ${({ showError }) => (showError ? '20px' : '0')};
`
export const FiatConverterInput = styled.div<{ marginTop?: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  margin-bottom: 0;
  margin-top: ${({ marginTop }) => marginTop || ''};
`
export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`
export const Unit = styled.span`
  padding: 0 15px;
  font-size: 12px;
  font-weight: 500;
  position: absolute;
  color: ${(props) => props.theme['text-black']};
`
export const Equals = styled(Text)`
  margin: 0 8px;
`
export const Error = styled(Text)<{
  errorBottom?: boolean
  showError?: boolean
}>`
  position: absolute;
  display: block;
  font-size: 12px;
  height: 15px;
  top: ${({ errorBottom, showError }) =>
    showError && errorBottom ? '50px' : errorBottom ? '40px' : '-20px'};
  ${({ errorBottom, showError }) => (showError && errorBottom ? `left: 0;` : `right: 0;`)}
`
