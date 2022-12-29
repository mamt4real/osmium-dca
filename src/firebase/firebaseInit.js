// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged as userChanged,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth'
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  // orderBy,
  setDoc,
} from 'firebase/firestore/lite'
import assets, { transactions } from '../data/assets'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDny1vXCCfIniHh5f-vWnUw-S34m1TMbNA',
  authDomain: 'osmium-portfolio-tracker.firebaseapp.com',
  projectId: 'osmium-portfolio-tracker',
  storageBucket: 'osmium-portfolio-tracker.appspot.com',
  messagingSenderId: '861535454728',
  appId: '1:861535454728:web:bc4886f9c7e9b8201873bd',
}

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

const devEnv = false

const getAll = async (colname) => {
  if (devEnv) {
    switch (colname) {
      case 'invoices':
        return transactions
      case 'transactions':
        return transactions
      case 'assets':
        return assets
      default:
        return []
    }
  }
  const docsRef = collection(db, colname)
  const docsSnapshot = await getDocs(docsRef)
  const invoices = []
  docsSnapshot.forEach((doc) =>
    invoices.push({
      ...doc.data(),
      id: doc.id,
    })
  )
  return invoices
}

const getOne = async (colname, id) => {
  if (devEnv) {
    return transactions.find((x) => x.id === id)
  }
  const docRef = doc(db, colname, id)
  const docSnapshot = await getDoc(docRef)
  return { ...docSnapshot.data(), id: docSnapshot.id }
}

const createOne = async (colname, data) => {
  if (devEnv) {
    const newDoc = { ...data, id: Math.floor(Math.random() * 123456789009876) }
    return newDoc
  }
  const colRef = collection(db, colname)
  const newDocRef = await addDoc(colRef, data)
  const newDoc = await getDoc(newDocRef)
  return { ...newDoc.data(), id: newDoc.id }
}

const updateOne = async (colname, docData) => {
  if (devEnv) {
    let data
    switch (colname) {
      case 'invoices':
        data = transactions
        break
      case 'assets':
        data = assets
        break
      default:
        data = []
    }
    console.log(data)
    const index = data.findIndex((x) => x.id === docData.id)
    console.log(index)
    if (index > -1) {
      data[index] = { ...data[index], ...docData }
      return data[index]
    }
    console.log(index)
    return
  }
  const docRef = doc(db, colname, docData.id)
  await updateDoc(docRef, docData, { merge: true })
  const updated = await getDoc(docRef)
  return { id: updated.id, ...updated.data() }
}

const deleteOne = async (colname, id) => {
  if (devEnv) {
    const index = transactions.findIndex((x) => x.id === id)
    transactions.splice(index, 1)
    return
  }
  const docRef = doc(db, colname, id)
  await deleteDoc(docRef)
}

const createUser = async (email, password, name, role = 'client') => {
  if (devEnv) {
    const newUser = {
      id: Math.floor(Math.random() * 123456789009876),
      email,
      name,
      password,
      role,
    }
    transactions.push(newUser)
    return [newUser, 'User Created Successfully']
  }
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    if (userCredentials) {
      const authUser = userCredentials.user
      await setDoc(doc(db, 'users', authUser.uid), {
        displayName: authUser.displayName,
        email: authUser.email,
        image: authUser.photoURL,
        phone: authUser.phoneNumber,
        name,
        role,
        date_registered: new Date(),
      })
      const user = await getOne('transactions', authUser.uid)
      return [user, 'User Created Successfully']
    } else {
      return [null, 'Something went wrong!']
    }
  } catch (err) {
    return [null, `${err.code}: ${err.message}`]
  }
}

/**
 * Login a user
 * @param {String} email
 * @param {String} password
 * @returns {User} signed in user
 */

const signIn = async (email, password) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )

    if (userCredentials) {
      const authUser = userCredentials.user

      const userSnapshot = await getDoc(doc(db, 'users', authUser.uid))
      return [
        {
          id: userSnapshot.id,
          ...userSnapshot.data(),
        },
        'Login Successfully',
      ]
    } else {
      return [null, 'Something went wrong!']
    }
  } catch (err) {
    console.log(err.message)
    return [null, `${err.code}: ${err.message}`]
  }
}

const logOut = async () => {
  await signOut(auth)
  localStorage.setItem('user', null)
}

const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email)
  return [true, 'Link sent to your email successfully']
}

const updateUserPassword = async (oldpass, newPass, user) => {
  if (devEnv) {
    const current = transactions.find((u) => u.id === user.id)
    if (current.password !== oldpass) return [null, 'Invalid Passsword']
    current.password = newPass
    return [current, 'Password Changed Successfully']
  }
  try {
    const current = auth.currentUser
    const creadential = EmailAuthProvider.credential(current.email, oldpass)
    const userCredential = await reauthenticateWithCredential(
      current,
      creadential
    )
    if (!userCredential) {
      return [null, 'Invalid Passwsord']
    }
    await updatePassword(current, newPass)
    return [current, 'Password changed successfully']
  } catch (error) {
    console.log(error)
    return [null, error.message?.split('auth/')[1].strip(')')]
  }
}

/**
 * Retrieve all tranactions recorded for a specific user
 * @param {String} userId The users id
 * @returns {[Transactions]} List of users transactions
 */
const getUserTransactions = async (userId) => {
  const tranQuery = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    where('isDeleted', '==', false)
  )
  const docsSnapshot = await getDocs(tranQuery)
  const transactions = []
  docsSnapshot.forEach((doc) => {
    transactions.push({
      id: doc.id,
      ...doc.data(),
    })
  })
  return transactions
}

const clearHistory = async (queryObj) => {
  const snapshots = await getDocs(queryObj)
  const updates = []
  snapshots.forEach((doc) => {
    updates.push(updateDoc(doc.ref, { isDeleted: true }))
  })
  await Promise.all(updates)
}

/**
 * Clears the pre-stored transactions for a particular asset
 * In users transactions
 * @param {String} userId The User id
 * @param {String} asset The asset to clear its records
 */
const clearAssetHistory = async (userId, asset) => {
  const clearQuery = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    where('asset', '==', asset),
    where('isDeleted', '==', false)
  )

  return clearHistory(clearQuery)
}

/**
 * Clears all pre-stored transactions for a particular User
 * @param {String} userId The User id
 */
const clearUserAssets = async (userId) => {
  const clearQuery = query(
    collection(db, 'transactions'),
    where('userId', '==', userId),
    where('isDeleted', '==', false)
  )
  return clearHistory(clearQuery)
}

const exports = {
  devEnv,
  auth,
  getUserTransactions,
  clearAssetHistory,
  clearUserAssets,
  updateUserPassword,
  createOne,
  getAll,
  getOne,
  deleteOne,
  updateOne,
  signIn,
  logOut,
  resetPassword,
  createUser,
  userChanged,
}

export default exports
