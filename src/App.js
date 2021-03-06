import React, { useEffect, useRef, useState } from 'react'
import './App.css'

import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { FirebaseConfig } from './components/fbauth/FirebaseConfig.js'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'

FirebaseConfig()

const auth = firebase.auth()
const firestore = firebase.firestore()

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
  const messagesRef = firestore.collection('messages')
  const query = messagesRef.orderBy('createdAt').limitToLast(25)
  const bottom = useRef()

  const [messages] = useCollectionData(query, { idField: 'id' })

  const [formValue, setFormValue] = useState('')

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
    bottom.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <>
      <main>
        {messages && messages.map(msg => {
          return <ChatMessage key={msg.id} message={msg} />
        })}

        <span ref={bottom}></span>
      </main>

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

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt='User' />
        <p>{text}</p>
      </div>
    </>
  )
}

function App() {
  const [user] = useAuthState(auth)

  return (
    <div className='App'>
      <header>
        <h1>Firebase Chat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

export default App;
