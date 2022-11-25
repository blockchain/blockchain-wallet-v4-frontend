import React, { useEffect, useRef, useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import Base64 from 'base-64'
import { bindActionCreators } from 'redux'

import { FileUploadItem, RemoteDataType } from '@core/types'
import { actions, selectors } from 'data'

import UploadDocuments from './template'

const UploadDocumentsContainer = (props: Props) => {
  const [searchParams] = useSearchParams()
  const { token: tokenFromParams } = useParams()
  const search = new URLSearchParams(searchParams)
  const dropzoneRef = useRef<any>(null)
  const [files, setFiles] = useState<Array<File>>([])

  const token = tokenFromParams || ''
  const redirectUrl = search.get('redirect_url')

  useEffect(() => {
    props.fetchUploadData({ token })
  }, [])

  const onSubmit = () => {
    const filesLoaded: Array<FileUploadItem> = []
    files.forEach((file) => {
      const fileReader = new FileReader()
      // One single upload for the array of all byte arrays
      fileReader.onload = (event) => {
        if (event?.target?.result) {
          const fileResults = event.target.result
          const fileArray = new Uint8Array(fileResults as ArrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
          const encodedArr = Base64.encode(fileArray)
          if (encodedArr) {
            filesLoaded.push(encodedArr)
            if (filesLoaded.length >= files.length) {
              props.uploadDocuments({ files: filesLoaded, redirectUrl, token })
            }
          }
        }
      }
      fileReader.readAsArrayBuffer(file)
    })
  }

  const deleteFileAt = (index: number) => {
    const newFiles = files.splice(index, 1)
    setFiles(newFiles)
  }

  const onDropAccepted = (uploadedFiles) => {
    const fileSizeLimit = 3 * 1024 * 1024
    uploadedFiles.forEach((file) => {
      if (file.size >= fileSizeLimit) {
        props.displayError('File over size limit')
      } else if (uploadedFiles.length >= 3) {
        props.displayError('Maximum number of files reached')
      } else {
        const newFiles = [...files, file]
        setFiles(newFiles)
      }
    })
  }

  const openDropzone = () => {
    dropzoneRef.current.open()
  }

  const { loading } = props.uploaded.cata({
    Failure: () => ({ loading: false }),
    Loading: () => ({ loading: true }),
    NotAsked: () => ({ loading: false }),
    Success: () => ({ loading: false })
  })

  return (
    <UploadDocuments
      data={props.data}
      files={files}
      dropzoneRef={dropzoneRef}
      deleteFileAt={deleteFileAt}
      onDropAccepted={onDropAccepted}
      openDropzone={openDropzone}
      onSubmit={onSubmit}
      loading={loading}
    />
  )
}

const mapStateToProps = (state) => ({
  data: selectors.components.uploadDocuments.getData(state),
  uploaded: selectors.components.uploadDocuments.getUploaded(state)
})

const mapDispatchToProps = (dispatch) => ({
  displayError: bindActionCreators(actions.alerts.displayError, dispatch),
  fetchUploadData: bindActionCreators(actions.components.uploadDocuments.fetchData, dispatch),
  uploadDocuments: bindActionCreators(actions.components.uploadDocuments.upload, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  data: object
  displayError: () => void
  uploadDocuments: () => void
  uploaded: RemoteDataType<string, any>
}

type Props = OwnProps & ConnectedProps<typeof connector>

export default connector(UploadDocumentsContainer as any)
