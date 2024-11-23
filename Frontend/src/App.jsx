import { Spinner } from '@chakra-ui/react'
import './App.css'
import React, { Suspense } from 'react'
import {Route,Routes} from 'react-router-dom'
const ChatPage = React.lazy(()=>import("./pages/ChatPage"))
const HomePage = React.lazy(()=>import("./pages/HomePage"))

function App() {
  return (
    <>
      <div className="app">
        <Suspense fallback={<Spinner size='lg'/>}>
        <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path="/chats" element={<ChatPage/>}/>
        </Routes>
        </Suspense>
      </div>
    </>
  )
}

export default App
