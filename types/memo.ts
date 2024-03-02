import { type Timestamp } from 'firebase/firestore'

interface Memo {
  id: string
  body: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type { Memo }
