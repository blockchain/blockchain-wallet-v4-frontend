export default ({ apiUrl, post, put }) => {
  const createUser = userData =>
    // post({
    //   url: apiUrl,
    //   endPoint: '/users'
    //   data: { ...userData }
    // })
    Promise.resolve(userData)

  const updateUser = (userId, userData) =>
    // put({
    //   url: apiUrl,
    //   endPoint: '/users/${userId}',
    //   data: { applicantId }
    // })
    Promise.resolve(userData)

  return {
    createUser,
    updateUser
  }
}
