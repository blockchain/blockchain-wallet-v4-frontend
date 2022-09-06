import React, { useCallback, useMemo, useState } from 'react'
import {
  IconCheck,
  IconClipboard,
  PaletteColors,
  useCopyToClipboard
} from '@blockchain-com/constellation'
import styled from 'styled-components'

import { debounce } from 'utils/helpers'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`
const StyledInput = styled.input`
  width: 100%;
  padding: 16px;
  padding-right: 32px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.grey100};
  &::placeholder {
    color: ${({ theme }) => theme.grey400};
    font-weight: 500;
    font-size: 16px;
  }
`

const IconWrapper = styled.div`
  position: absolute;
  height: 100%;
  right: 4px;
  top: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
`

const TextInputWithClipboard: React.FC<Props> = ({ value }) => {
  const [v, copy] = useCopyToClipboard()
  const [showCopiedIcon, setShowCopiedIcon] = useState<boolean>(false)

  const hideCopiedIconDebounce = useMemo(
    () => debounce(() => setShowCopiedIcon(false), 300),
    [setShowCopiedIcon]
  )

  const handleOnClickToCopyText = useCallback(() => {
    copy(value)

    setShowCopiedIcon(true)

    hideCopiedIconDebounce()
  }, [copy, value, hideCopiedIconDebounce])

  return (
    <Wrapper>
      <StyledInput disabled value={value} />
      <IconWrapper onClick={handleOnClickToCopyText}>
        {showCopiedIcon ? (
          <IconCheck color={PaletteColors['green-600']} label='copy' />
        ) : (
          <IconClipboard color={PaletteColors['blue-600']} label='copy' />
        )}
      </IconWrapper>
    </Wrapper>
  )
}

type Props = {
  value: string
}

export default TextInputWithClipboard
