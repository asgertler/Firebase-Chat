import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export const FirebaseConfig = () => {
    firebase.initializeApp({
        apiKey: "AIzaSyCtFqdQBWyvbtkW8ilIUL0gLSZAWiBEYys",
        authDomain: "fir-chat-5a132.firebaseapp.com",
        projectId: "fir-chat-5a132",
        storageBucket: "fir-chat-5a132.appspot.com",
        messagingSenderId: "982749765635",
        appId: "1:982749765635:web:c370d7a7964779dc846e36",
        measurementId: "G-YM1N2ZHMDL"
    })
}