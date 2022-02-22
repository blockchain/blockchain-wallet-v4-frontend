import styled from 'styled-components'

import { Button, SelectInput, Text } from 'blockchain-info-components'
import { SceneWrapper } from 'components/Layout'
import MenuHeader from 'components/MenuHeader'

export const Title = styled(Text)`
  margin-bottom: 8px;
`

export const MenuHeaderCentered = styled(MenuHeader)`
  align-items: center;
`

export const Box = styled.div`
  position: relative;
  margin-top: 64px;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.grey000};
  display: flex;
  flex: 1;
`

export const Slide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const Container = styled(SceneWrapper)`
  padding: 0 8px;
`

export const Footer = styled.div`
  padding: 24px;
  height: 300px;
  text-align: center;
`
export const Content = styled.div`
  display: flex;
  align-items: center;
`

export const SelectGroup = styled.div`
  height: 75px;
`

export const StyledSelect = styled(SelectInput)`
  width: 172px;
  margin-right: 16px;
`

export const SelectLabel = styled(Text)`
  margin-bottom: 8px;
`

export const GenerateButton = styled(Button)`
  margin-top: 24px;
  height: 48px;
`

export const VisitButton = styled(Button)`
  margin-top: 16px;
  height: 48px;
`
