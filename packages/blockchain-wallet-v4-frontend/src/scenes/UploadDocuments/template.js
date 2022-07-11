import React from 'react'
import Dropzone from 'react-dropzone'
import { FormattedMessage } from 'react-intl'
import { FasIdBadge, FasIdCard, FasPassport } from '@blockchain-com/components'
import PropTypes from 'prop-types'
import { prop } from 'ramda'
import styled from 'styled-components'

import { Button, HeartbeatLoader, Link, Text, TextGroup } from 'blockchain-info-components'
import { media } from 'services/styles'

const FileContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  border: 1px solid ${(props) => props.theme.blue200};
  border-radius: 4px;
  padding: 4px;
  width: 100%;
`

const FileInfo = styled.div`
  display: flex;
  flex-direction: column;
`
const FilesList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`
const Icons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  & > * {
    fill: ${(props) => props.theme.blue900};
  }
`
const IdContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 20px;

  & > * {
    padding-bottom: 12px;
  }
`
const UploadButton = styled(Button)`
  margin-top: 16px;
`
const UploadZone = styled(Dropzone)`
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  background-color: ${(props) => props.theme.white};
  border: 1px solid ${(props) => props.theme.blue200};
  border-radius: 8px;
  padding: 8px;
`
const UploadZoneContainer = styled.div`
  padding: 16px;
  border: 1px dashed ${(props) => props.theme.blue200};
  border-radius: 8px;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 35px;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.grey000};

  ${media.tablet`
    flex-direction: column;
  `}
`

const AdditionalInfoWrapper = styled.div`
  margin-top: 20px;
  ul {
    margin: 0;
  }
  a {
    color: ${(props) => props.theme.blue600};
    cursor: pointer;
    text-decoration: none;
  }
`

const Separator = styled.div`
  padding-bottom: 0;
  border-top: solid 1px ${(props) => props.theme.blue900};
`

const isMobile = window.matchMedia('(max-width: 760px)')

const renderAdditionalSectionIDAndPassport = () => {
  return (
    <AdditionalInfoWrapper>
      <Text color='blue900' size='16px' weight={500} styled={{ paddingBottom: 0 }}>
        <FormattedMessage
          id='scenes.uploaddoc.title'
          defaultMessage='Before uploading, be sure that your ID/Passport:'
        />
      </Text>
      <ul>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.is_current_and_valid'
              defaultMessage='Is current and valid'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.is_not_damaged'
              defaultMessage='Is not damaged.'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.appears_well_lit'
              defaultMessage='Appears well lit and does not have any glare.'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.in_focus'
              defaultMessage='Is in focus and fully visible.'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.not_a_photocopy'
              defaultMessage='Is not a photocopy or a scanned document'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.from_country_of_residence'
              defaultMessage='Is from your country of residence.'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.issued_by_the_official'
              defaultMessage='Is issued by the official authority of your country.'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.it_truly_yours'
              defaultMessage='Is truly yours and the photo on it corresponds to your facial check photo or video.'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.make_sure_provide_valid'
              defaultMessage='Please make sure you also provide a valid ID from this list: <a>Accepted documents by country</a>'
              values={{
                a: (msg) => (
                  <a
                    href='https://support.blockchain.com/hc/en-us/articles/360018401251-Accepted-documents-by-country'
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    {msg}
                  </a>
                )
              }}
            />
          </Text>
        </li>
      </ul>
    </AdditionalInfoWrapper>
  )
}
const renderAdditionalSectionSelfie = () => {
  return (
    <AdditionalInfoWrapper>
      <Text color='blue900' size='16px' weight={500} styled={{ paddingBottom: 0 }}>
        <FormattedMessage
          id='scenes.uploaddoc.selfie.title'
          defaultMessage='If you are uploading a selfie, please ensure the following:'
        />
      </Text>
      <ul>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.selfie.face'
              defaultMessage='Your face can be seen plainly, please remove glasses, headphones, masks, and all other headgear that make it harder to identify you.'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.selfie.lightening'
              defaultMessage='The room that you are in has good lighting'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.selfie.not_blurry'
              defaultMessage='The selfie is not blurry or has any glare'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.selfie.not_someone_else'
              defaultMessage='You are not taking a picture of a photograph of yourself or of someone else'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.selfie.no_multiple_faces'
              defaultMessage='There are not multiple faces in the selfie'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.selfie.camera_in_face'
              defaultMessage='Selfie works best if the camera is directly in front of your face'
            />
          </Text>
        </li>
        <li>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.selfie.hold_the_phone'
              defaultMessage='Make sure to hold the phone within a foot of your face so that we can clearly see your face'
            />
          </Text>
        </li>
      </ul>
    </AdditionalInfoWrapper>
  )
}

const UploadDocuments = ({
  data,
  deleteFileAt,
  files,
  loading,
  onDropAccepted,
  onSubmit,
  openDropzone,
  setDropzoneRef
}) => {
  const isIDPresent =
    prop('documentsTypes', data) &&
    data.documentsTypes.filter(
      (doc) => doc.toLowerCase().includes('passport') || doc.toLowerCase().includes('id card')
    ).length > 0
  const isSelfiePresent =
    prop('documentsTypes', data) &&
    data.documentsTypes.filter((doc) => doc.toLowerCase().includes('selfie')).length > 0

  return (
    <Wrapper>
      <TextContainer>
        <TextGroup inline>
          <Text color='blue900' size='16px' weight={400}>
            <FormattedMessage id='scenes.uploaddoc.hello' defaultMessage='Hello ' />
          </Text>
          <Text color='blue900' size='16px' weight={400}>
            {prop('firstName', data)},
          </Text>
        </TextGroup>
        <Text color='blue900' size='16px' weight={400}>
          <FormattedMessage
            id='scenes.uploaddoc.verify'
            defaultMessage='We need to verify your identity in order to allow buys,
          sells or exchanges.'
          />
        </Text>
        <Text color='blue900' size='16px' weight={400}>
          <FormattedMessage
            id='scenes.uploaddoc.docs'
            defaultMessage='Please upload the following documents: '
          />
        </Text>
        <ul>
          {prop('documentsTypes', data) &&
            data.documentsTypes.map((type) => (
              <li key={type}>
                <Text color='blue900' size='24px' weight={600}>
                  {type}
                </Text>
              </li>
            ))}
        </ul>
        <Separator />
        {isIDPresent ? renderAdditionalSectionIDAndPassport() : null}
        {isSelfiePresent ? renderAdditionalSectionSelfie() : null}
      </TextContainer>
      <UploadZoneContainer>
        <UploadZone
          accept='image/jpeg, application/pdf, image/png'
          disableClick
          onDropAccepted={onDropAccepted}
          ref={setDropzoneRef}
        >
          {files.length === 0 ? (
            <>
              {isMobile.matches ? (
                <Link onClick={openDropzone} weight={500}>
                  <FormattedMessage
                    id='scenes.uploaddoc.browsefiles'
                    defaultMessage='Browse files'
                  />
                </Link>
              ) : (
                <>
                  <Text color='blue900' size='20px' weight={400}>
                    <FormattedMessage
                      id='scenes.uploaddoc.dragdrop'
                      defaultMessage='Drag &amp; Drop'
                    />
                  </Text>
                  <TextGroup inline>
                    <Text color='blue900' weight={400}>
                      <FormattedMessage
                        id='scenes.uploaddoc.placefiles'
                        defaultMessage='Place your files here, '
                      />
                    </Text>
                    <Link onClick={openDropzone} weight={500}>
                      <FormattedMessage id='scenes.uploaddoc.browse' defaultMessage='or browse' />
                    </Link>
                  </TextGroup>
                </>
              )}
              <Icons>
                <IdContainer>
                  <FasPassport />
                  <Text color='blue900' size='12px' weight={400}>
                    <FormattedMessage id='scenes.uploaddoc.passport' defaultMessage='Passport' />
                  </Text>
                </IdContainer>
                <IdContainer>
                  <FasIdBadge />
                  <Text color='blue900' size='12px' weight={400}>
                    <FormattedMessage
                      id='scenes.uploaddoc.drivinglicense'
                      defaultMessage='Driving license'
                    />
                  </Text>
                </IdContainer>
                <IdContainer>
                  <FasIdCard />
                  <Text color='blue900' size='12px' weight={400}>
                    <FormattedMessage id='scenes.uploaddoc.idcard' defaultMessage='ID Card' />
                  </Text>
                </IdContainer>
              </Icons>
            </>
          ) : (
            <>
              <FilesList>
                {files.map((file, index) => (
                  <FileContainer key={file}>
                    <FileInfo>
                      <Text color='blue900' size='12px' weight={400}>
                        {file.name}
                      </Text>
                      <Text color='blue900' size='12px' weight={400}>
                        {`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      </Text>
                    </FileInfo>
                    <Text
                      color='grey400'
                      cursor='pointer'
                      onClick={() => deleteFileAt(index)}
                      size='12px'
                      weight={400}
                    >
                      <FormattedMessage id='scenes.uploaddoc.deletedoc' defaultMessage='Delete' />
                    </Text>
                  </FileContainer>
                ))}
              </FilesList>
              <Link cursor='pointer' onClick={openDropzone} weight={500}>
                <FormattedMessage
                  id='scenes.uploaddoc.browsecomputer'
                  defaultMessage='Browse my computer'
                />
              </Link>
            </>
          )}
          <Text color='grey400' size='14px' weight={400}>
            <FormattedMessage
              id='scenes.uploaddoc.filesize'
              defaultMessage='Please upload a JPG, PNG or PDF up to 3MB in size.'
            />
          </Text>
          {files.length > 0 && (
            <UploadButton nature='primary' onClick={onSubmit} disabled={loading}>
              {loading ? (
                <HeartbeatLoader height='20px' width='20px' color='white' />
              ) : (
                <FormattedMessage id='scenes.uploaddoc.uploadnow' defaultMessage='Upload Now' />
              )}
            </UploadButton>
          )}
        </UploadZone>
      </UploadZoneContainer>
    </Wrapper>
  )
}

UploadDocuments.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.object,
  deleteFileAt: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  files: PropTypes.array.isRequired,
  onDropAccepted: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  openDropzone: PropTypes.func.isRequired,
  setDropzoneRef: PropTypes.func.isRequired
}

export default UploadDocuments
