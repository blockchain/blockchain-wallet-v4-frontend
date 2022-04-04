import React, { memo, MouseEventHandler } from 'react'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { ClickableArea } from 'components/ClickableArea'
import { Flex } from 'components/Flex'
import { PaddingAll } from 'components/Padding'

const LoadingTextDark = styled.div`
  background-color: ${(props) => props.theme.grey100};
  border-radius: 10px;
  width: 75px;
  height: 16px;
  margin-bottom: 3px;
`

const LoadingTextLight = styled.div`
  background-color: ${(props) => props.theme.grey000};
  border-radius: 10px;
  width: 50px;
  height: 14px;
  margin-bottom: 3px;
`

const LoadingIcon = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.grey000};
`

const StandardRow = memo<Props>(
  ({ bottomLeftText, bottomRightText, icon, loading, onClick, topLeftText, topRightText }) => {
    if (loading) {
      bottomLeftText = <LoadingTextLight />
      bottomRightText = <LoadingTextLight />
      topLeftText = <LoadingTextDark />
      topRightText = <LoadingTextDark />
      icon = <LoadingIcon />
    }

    return (
      <ClickableArea onClick={onClick}>
        <PaddingAll size={16}>
          <Flex gap={16} justifyContent='space-between'>
            <Flex gap={16} flexDirection='row'>
              <Flex alignItems='center' justifyContent='center'>
                {icon}
              </Flex>
              <Flex gap={1} flexDirection='column'>
                <Text weight={600} size='16px' color='grey900'>
                  {topLeftText}
                </Text>
                <Text weight={500} size='14px' color='grey600'>
                  {bottomLeftText}
                </Text>
              </Flex>
            </Flex>

            <Flex gap={1} flexDirection='column'>
              <Text weight={600} size='16px' color='grey900' style={{ textAlign: 'right' }}>
                {topRightText}
              </Text>
              <Text weight={500} size='14px' color='grey600' style={{ textAlign: 'right' }}>
                {bottomRightText}
              </Text>
            </Flex>
          </Flex>
        </PaddingAll>
      </ClickableArea>
    )
  }
)

export type Props =
  | {
      bottomLeftText: string | React.ReactNode
      bottomRightText: string | React.ReactNode
      icon: React.ReactNode
      loading?: never
      onClick?: MouseEventHandler<HTMLDivElement>
      topLeftText: string | React.ReactNode
      topRightText: string | React.ReactNode
    }
  | {
      bottomLeftText?: never
      bottomRightText?: never
      icon?: never
      loading: true
      onClick?: MouseEventHandler<HTMLDivElement>
      topLeftText?: never
      topRightText?: never
    }

export default StandardRow
