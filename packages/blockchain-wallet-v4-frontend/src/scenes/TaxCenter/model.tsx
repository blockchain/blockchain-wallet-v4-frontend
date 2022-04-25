import styled from 'styled-components'

import { Button, SelectInput, Separator, Text, TextGroup } from 'blockchain-info-components'
import { SceneWrapper } from 'components/Layout'
import MenuHeader from 'components/MenuHeader'

export const FIRST_YEAR = 2014
export const BECH32_PREFIX = 'bc1'
export const XPUB_PREFIX = 'xpub'

export const getFirstAndLastDaysOfYear = (option) => {
  // Historical report from 2014 to yesterday
  if (option === 0) {
    return {
      from: new Date(Date.UTC(FIRST_YEAR, 0, 1)).toISOString(),
      to: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
    }
  }

  // Current year report from 01/01/current_year to yesterday
  if (option === new Date().getFullYear()) {
    return {
      from: new Date(Date.UTC(option, 0, 1)).toISOString(),
      to: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString()
    }
  }

  // Not current year report from 01/01/select_year to 31/12/select_year
  return {
    from: new Date(Date.UTC(option, 0, 1)).toISOString(),
    to: new Date(Date.UTC(option, 11, 31)).toISOString()
  }
}

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
  width: 100%;
`

export const StyledSeparator = styled(Separator)`
  margin: 0 0 10px 0;
`

export const AlertMessage = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    margin-left: 8px;
  }
`

export const LoadingContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 32px;
`
