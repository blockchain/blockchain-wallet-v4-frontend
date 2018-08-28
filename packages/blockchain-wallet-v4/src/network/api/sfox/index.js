export default () => {
  const uploadVerificationDocument = (url, file) =>
    fetch(url, {
      method: 'PUT',
      body: file,
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
