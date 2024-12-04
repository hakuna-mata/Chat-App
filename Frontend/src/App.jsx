import { Spinner,Center } from '@chakra-ui/react'
import './App.css'
import React, { Suspense } from 'react'
import {Route,Routes} from 'react-router-dom'
const ChatPage = React.lazy(()=>import("./pages/ChatPage"))
const HomePage = React.lazy(()=>import("./pages/HomePage"))

function App() {
  return (
    <>
      <div className="app">
        <Suspense fallback={ <Center height="100vh" flexDirection="column">
        <Spinner size="xl" ml="180px" color="blue.500" />
      </Center>}>
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
