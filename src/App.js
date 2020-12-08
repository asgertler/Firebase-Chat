import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyCtFqdQBWyvbtkW8ilIUL0gLSZAWiBEYys",
  authDomain: "fir-chat-5a132.firebaseapp.com",
  projectId: "fir-chat-5a132",
  storageBucket: "fir-chat-5a132.appspot.com",
  messagingSenderId: "982749765635",
  appId: "1:982749765635:web:c370d7a7964779dc846e36",
  measurementId: "G-YM1N2ZHMDL"
})

const auth = firebase.auth()
const firestore = firebase.firestore()

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className='App'>
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

export default App;

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    auth.signInWithPopup(provider)
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  const messageRef = firestore.collection('messages')
  const query = messageRef.orderBy('createdAt').limitToLast(25)

  const [messages] = useCollectionData(query, { idField: 'id' })

  return (
    <>
      <main>
        {messages && messages.map(msg => {
          <ChatMessage key={msg.id} message={msg} />
        })}
      </main>
    </>
  )
}

function ChatMessage() {
  const { text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} />
        <p>{text}</p>
      </div>
    </>
  )
}

function ChatRoom() {
  const [formValue, setFormValue] = useState('')

  const dummy = useRef()

  const sendMessage = async (evt) => {
    evt.preventDefault()

    const { uid, photoURL } = auth.currentUser

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('')
  }

  useEffect(() => {
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <>
      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(evt) => setFormValue(evt.target.value)}
          placeholder="don't be a jerk" />

        <button type='submit' disabled={!formValue}>✉️</button>
      </form>
    </>
  )
}