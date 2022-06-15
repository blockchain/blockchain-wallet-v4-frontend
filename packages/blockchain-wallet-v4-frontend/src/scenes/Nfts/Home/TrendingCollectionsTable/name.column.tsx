import React from 'react'
import { FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'
import Avatar from 'boring-avatars'
import styled from 'styled-components'

import { Link } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { CellHeaderText, CellText } from 'components/Table'
import { useMedia } from 'services/styles'

import NftCollectionImageSmall from '../../components/NftCollectionImageSmall'

const NameCell = styled(CellText)<{ role: 'button' }>`
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
`

export const getNameColumn = () => ({
  Cell: ({ row: { original: values } }) => {
    const isMobile = useMedia('mobile')
    const isTablet = useMedia('tablet')
    return (
      <NameCell cursor='pointer' role='button'>
        <LinkContainer to={`/nfts/collection/${values.slug}`}>
          <Link>
            <Flex gap={8}>
              {values.image_url ? (
                <NftCollectionImageSmall
                  alt=''
                  isVerified={values.safelist_request_status === 'verified'}
                  src={values.image_url}
                />
              ) : (
                <Avatar
                  size={24}
                  name={values.slug || ''}
                  variant='marble'
                  colors={['#0C6CF2', '#5322E5', '#F00699', '#06D6A0', '#121D33']}
                />
              )}

              <CellText>
                {isMobile || isTablet
                  ? values.name.length < 14
                    ? values.name
                    : `${values.name.slice(0, 10)}...`
                  : values.name.length < 24
                  ? values.name
                  : `${values.name.slice(0, 20)}...`}
              </CellText>
            </Flex>
          </Link>
        </LinkContainer>
      </NameCell>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.collection' defaultMessage='Collection' />
    </CellHeaderText>
  ),
  accessor: 'name',
  disableGlobalFilter: true
})
