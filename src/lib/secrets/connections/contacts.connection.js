import Realm from 'realm'
import { Contact } from '../models'
import RealmStore from '../../infra-data/realm.store'

const openRealmConnection = () => Realm.open({
  path: 'Realm.contacts',
  schema: [Contact],
  schemaVersion: 0
})

let _instance = null

export default async () => {
  if (!_instance) {
    const connection = await openRealmConnection()
    _instance = new RealmStore(connection, 'Contact')
  }

  return _instance
}
