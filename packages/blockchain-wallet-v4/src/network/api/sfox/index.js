export default ({ url }) => {
  const uploadVerificationDocument = (url, file) => fetch(url, {
    method: 'PUT',
    data: file,
    headers: new Headers({
      'Content-Type': 'application/octet-stream'
    })
  }).then(res => {
    return res
  })

  return {
    uploadVerificationDocument
  }
}
