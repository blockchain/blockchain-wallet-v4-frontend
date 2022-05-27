import { Cartridge } from '@blockchain-com/components'
import styled from 'styled-components'

export const CustomCartridge = styled(Cartridge)<{ cursor?: boolean }>`
  cursor: ${(props) => (props.cursor ? 'pointer' : 'default')};
  text-transform: none;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: ${(props) => (props.fontSize ? props.fontSize : '14px')};
  font-weight: 600;
  margin-left: 0px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

export const GreyCartridge = styled(CustomCartridge)`
  background-color: ${(props) => props.theme.grey000};
  color: ${(props) => props.theme.grey600};
`
export const GreyBlueGradientCartridge = styled(CustomCartridge)`
  background-color: ${(props) => props.theme.grey000};
  color: ${(props) => props.theme.grey600};
  > div {
    background: linear-gradient(92.37deg, #7349f2 4.69%, #2e7cf6 97.22%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`
export const BlueCartridge = styled(CustomCartridge)`
  background-color: ${(props) => props.theme.blue000};
  color: ${(props) => props.theme.blue600};
`
export const ErrorCartridge = styled(CustomCartridge)`
  background-color: ${(props) => props.theme.red000};
  color: ${(props) => props.theme.red600};
`
export const SuccessCartridge = styled(CustomCartridge)`
  background-color: ${(props) => props.theme.green000};
  color: ${(props) => props.theme.green600};
`
export const OrangeCartridge = styled(CustomCartridge)`
  background-color: ${(props) => props.theme.orange000};
  color: ${(props) => props.theme.orange600};
`
