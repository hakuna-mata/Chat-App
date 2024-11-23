import React, { Suspense } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import {Box, Spinner} from '@chakra-ui/react'

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
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Suspense>
    </Box>
  )
}

export default ChatBox
