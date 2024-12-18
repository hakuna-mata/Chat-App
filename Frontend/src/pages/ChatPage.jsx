import React, { useState } from "react";
import { Box } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/miscellaneous/MyChats"
import ChatBox from "../components/miscellaneous/ChatBox"
import {ErrorBoundary} from 'react-error-boundary'
import ErrorFallback from "../components/miscellaneous/ErrorFallback";

const ChatPage = ()=>{
    const{user}=ChatState()
    const[fetchAgain,setFetchAgain]=useState(false)
    return(
        <div style={{width:"100%"}}>
            {user && <SideDrawer/>}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px" >
                {user && <ErrorBoundary FallbackComponent={ErrorFallback}><MyChats fetchAgain={fetchAgain} /></ErrorBoundary>}
                {user && <ErrorBoundary FallbackComponent={ErrorFallback}> <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /></ErrorBoundary>}
            </Box>
        </div>
    )
}

export default ChatPage