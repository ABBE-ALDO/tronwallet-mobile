let _oneSignalId = null

export const setOneSignalId = (id) => {
  _oneSignalId = id
}

export const getOneSignalId = () => {
  if (!_oneSignalId) {
    throw new Error('OneSignalId isn\'t loaded')
  }

  return _oneSignalId
}

export const clear = () => {
  _oneSignalId = null
}
