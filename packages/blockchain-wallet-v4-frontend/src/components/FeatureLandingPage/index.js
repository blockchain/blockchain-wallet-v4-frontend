import media from 'services/ResponsiveService'
import styled from 'styled-components'
import { Text } from 'blockchain-info-components'

const containerWidth = '650px'
const containerPadding = '25px'
const marginContent = '25px'

export const Wrapper = styled.div`
  width: 100%;
  height: 90%;
  padding: ${props => (props.noPadding ? '0px' : '30px')};
  box-sizing: border-box;
`
export const IntroContainer = styled.div`
  padding-top: 20px;
`
export const GetStartedContainer = styled.div`
  position: relative;
  margin: 0 auto ${marginContent};
  padding: ${containerPadding};
  width: ${containerWidth};
  box-sizing: border-box;
  height: ${props => props.height};
  border: 1px solid ${props => props.theme['brand-quaternary']};
  border-radius: 3px;
  background-image: ${props => props.url};
  background-repeat: no-repeat;
  background-size: ${props => props.backgroundSize || 'auto 100%'};
  background-position: ${props => props.backgroundPosition || 'right'};
  ${media.mobile`
    width: 100%;
    background-image: none;
  `};
`

export const GetStartedContent = styled.div`
  width: 300px;
  ${media.mobile`
    width: 100%;
  `};
`

export const GetStartedHeader = styled(Text)`
  width: ${props => props.width};
  margin-bottom: ${marginContent};
  ${media.mobile`
    width: 100%;
  `};
`
export const GetStartedText = styled(Text)`
  width: 350px;
  margin-bottom: ${marginContent};
  ${media.mobile`
    width: 100%;
  `};
`
