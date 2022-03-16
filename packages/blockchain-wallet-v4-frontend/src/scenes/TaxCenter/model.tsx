import styled from 'styled-components'

import { Button, SelectInput, Separator, Text, TextGroup } from 'blockchain-info-components'
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
  flex-wrap: wrap;
  flex-direction: column;
  align-items: flex-start;
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

export const GenerateReport = styled.div`
  display: flex;
`

export const ReportList = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  flex: 1;
`

export const StyledTextGroup = styled(TextGroup)`
  align-content: space-around;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

export const StyledSeparator = styled(Separator)`
  margin: 0 0 10px 0;
`

export const AlertMessage = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;

  div {
    margin-left: 8px;
  }
`
