import React, { useCallback, useMemo, useState } from 'react'
import { Icon, useCopyToClipboard } from '@blockchain-com/constellation'
import { IconCheck, IconClipboard } from '@blockchain-com/icons'
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
        <Icon label='copy' color={showCopiedIcon ? 'green600' : 'blue600'}>
          {showCopiedIcon ? <IconCheck /> : <IconClipboard />}
        </Icon>
      </IconWrapper>
    </Wrapper>
  )
}

type Props = {
  value: string
}

export default TextInputWithClipboard
