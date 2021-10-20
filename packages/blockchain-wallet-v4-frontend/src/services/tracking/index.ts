const getTracking = ({ url }: { url: string }) =>
  fetch(`${url}/tracking`, {
    credentials: 'include'
  })

export { getTracking }
