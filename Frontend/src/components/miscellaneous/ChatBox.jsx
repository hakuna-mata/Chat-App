import React, { Suspense } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import {Box, Spinner} from '@chakra-ui/react'
import ErrorFallback from './ErrorFallback.jsx'
import {ErrorBoundary} from 'react-error-boundary'
const SingleChat = React.lazy(()=>import("../SingleChat.jsx"))
const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const{selectedChat}=ChatState()
  return (
    <Box display={{base:selectedChat?"flex":"none" , md:'flex'}}
    alignItems='center'
    flexDir='column'
    p={3}
    bg='white'
    w={{base:"100%",md:"68%"}}
    borderRadius='lg'
    borderWidth='1px'
    >
      <Suspense fallback={<Spinner size='lg'/>}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </ErrorBoundary>
      </Suspense>
    </Box>
  )
}

export default ChatBox
