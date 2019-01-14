import { getSecretStore } from '../lib/secrets'

const getStore = async () => {
  const secretsStore = await getSecretStore()
  return secretsStore.connection.db
}

export default getStore
