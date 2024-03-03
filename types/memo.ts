import { type Timestamp } from 'firebase/firestore'

interface Memo {
  id: string
  body: string
  created_at: Timestamp
  updated_at: Timestamp
}

export type { Memo }
