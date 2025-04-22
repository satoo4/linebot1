import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// すでに初期化済みかチェック（Nuxtでホットリロードがあると複数回初期化されることがあるため）
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // \n を改行に変換
    }),
  })
}

// Firestoreのインスタンスをエクスポート
export const db = getFirestore()
