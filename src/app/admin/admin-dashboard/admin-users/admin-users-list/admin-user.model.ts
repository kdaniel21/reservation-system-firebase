// Interface of the data stored in Firestore
export interface StoredUser {
  admin: boolean,
  uid: string,
  deleted: boolean,
  disabled: boolean,
  email: string,
  name: string,
  registered: Date,
  registeredBy: string,
  reservations: string[]
}
