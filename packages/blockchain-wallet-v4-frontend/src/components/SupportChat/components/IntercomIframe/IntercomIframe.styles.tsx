import styled from 'styled-components'

// must be section so global style doesnt overwrite position style
export const RelativeWrapper = styled.section`
  position: relative;
`
export const AbsoluteWrapper = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: ${(props) => (props.isOpen ? '10000' : '10')};
`
export const Iframe = styled.iframe<{ isOpen: boolean }>`
  height: ${(props) => (props.isOpen ? '740px' : '84px')};
  width: ${(props) => (props.isOpen ? '421px' : '84px')};
  border: none;
`
