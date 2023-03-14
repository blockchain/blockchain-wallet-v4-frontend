import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Flex,
  IconCloseCircleV2,
  Padding,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'

import { useRemote } from 'hooks'
import modalEnhancer from 'providers/ModalEnhancer'

import { tableData } from './EarnCompare.model'
import { getRemote } from './EarnCompare.selectors'
import { CloseContainer, CustomModal, TableContainer } from './EarnCompare.styles'
import TableRow from './TableRow'
import { TableRowPropsType } from './TableRow/TableRow.types'

const EarnCompare = ({ closeAll }: OwnProps) => {
  const { data } = useRemote(getRemote)
  const { maxActiveRate = '- ', maxPassiveRate = '- ', maxStakingRate = '- ' } = data || {}

  const handleClose = () => {
    closeAll()
  }

  return (
    <CustomModal size='xlarge'>
      <Padding bottom={1.5} horizontal={1.5}>
        <Flex alignItems='center' justifyContent='space-between' width='fill'>
          <Text color={SemanticColors.title} variant='body2'>
            <FormattedMessage
              defaultMessage='Compare Earn products'
              id='modals.earn-compare.title'
            />
          </Text>
          <CloseContainer>
            <IconCloseCircleV2 color={SemanticColors.muted} onClick={handleClose} size='large' />
          </CloseContainer>
        </Flex>
      </Padding>
      <Padding bottom={1}>
        <TableContainer>
          {tableData({ maxActiveRate, maxPassiveRate, maxStakingRate }).map(
            ({
              activeInfo,
              hasBorder,
              key,
              passiveInfo,
              stakingInfo,
              title
            }: TableRowPropsType) => (
              <TableRow
                activeInfo={activeInfo}
                hasBorder={hasBorder}
                key={key}
                passiveInfo={passiveInfo}
                stakingInfo={stakingInfo}
                title={title}
              />
            )
          )}
        </TableContainer>
      </Padding>
      <Button
        as='button'
        onClick={handleClose}
        size='large'
        state='initial'
        text={
          <FormattedMessage
            defaultMessage='Get started with just $1'
            id='modals.earn-compare.button'
          />
        }
        type='button'
        variant='primary'
        width='full'
      />
    </CustomModal>
  )
}

type OwnProps = {
  closeAll: () => void
}

export default modalEnhancer('EARN_COMPARE')(EarnCompare)
