import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, FormControl, IconButton, Spinner, Text,Input, useToast } from '@chakra-ui/react'
import {ArrowBackIcon} from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../config/chatLogics'
import ProfileModel from './miscellaneous/ProfileModel'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'
import axios from 'axios'
import "./styles.css"
import io from 'socket.io-client'
import Lottie from 'react-lottie'
import animationData from '../animation/typing.json'

const ENDPOINT = "http://localhost:8080"
var socket,selectedChatCompare

const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const[messages,setMessages]=useState([])
    const[loading,setLoading]=useState(false)
    const[newMessage,setNewMessage]=useState("")
    const{user,selectedChat,setSelectedChat,notification,setNotification}=ChatState()
    const[socketConnected,setSocketConnected]=useState(false)
    const[typing,setTyping]=useState(false)
    const[isTyping,setIsTyping]=useState(false)

    const defaultOptions = {
        loop:true,
        autoplay:true,
        animationData:animationData,
        renderSettings:{
            preserveAspectRatio:"xMidYMid slice"
        }
    }



    //  console.log(messages);
     

    const toast = useToast()

    const fetchMessages = async () => {
        if (!selectedChat) return;
    
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            const { data } = await axios.get(`http://localhost:8080/api/message/${selectedChat._id}`, config);
            // console.log("Fetched messages:", data);
            setMessages(data); 
            setLoading(false);
            socket.emit("join chat",selectedChat._id)
        } catch (error) {
            toast({
                title: "Error occurred!",
                description: "Failed to load messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    };
    
    useEffect(() => {
        socket = io(ENDPOINT); // Create the socket connection
    
        socket.emit("setup", user);
    
        socket.on("connected", () => {
            setSocketConnected(true);
        });

        socket.on("typing",()=>setIsTyping(true))

        socket.on("stop typing",()=>setIsTyping(false))
    
        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
    }, [user]); // Ensure `user` is set when connecting

    useEffect(() => {
        if (!selectedChat) return;
    
        setMessages([]); 
        fetchMessages(); 
        selectedChatCompare=selectedChat
    }, [selectedChat]);

    useEffect(()=>{
        socket.on("message received",(newMessageReceived)=>{
            if(!selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ){
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived,...notification]);
                    // setFetchAgain(!fetchAgain);
                  }
            }else{
                setMessages([...messages,newMessageReceived]);
            }
        })
    })

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing",selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
    
                const { data } = await axios.post('http://localhost:8080/api/message', {
                    content: newMessage,
                    chat: selectedChat._id,
                }, config);
    
                socket.emit("new message",data)
                setMessages([...messages, data]); 
                setNewMessage("");
            } catch (error) {
                toast({
                    title: "Error occurred!",
                    description: "Failed to send a message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const typingHandler = (e)=>{
        setNewMessage(e.target.value)

        if(!socketConnected)return

        if(!typing){
            setTyping(true)
            socket.emit("typing",selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(()=>{
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime

            if(timeDiff>=timerLength && typing){
                socket.emit("stop typing",selectedChat._id)
                setTyping(false)
            }
        },timerLength)
    }

  return (
    <>
    {selectedChat?<>
    <Text fontSize={{base:'28px',md:'30px' }} pb={3} px={2} w='100%' fontFamily='Work sans' display='flex' justifyContent={{base:"space-between"}} alignItems='center' >
        <IconButton display={{base:'flex' ,md:'none' }} icon={<ArrowBackIcon/>} onClick={()=>setSelectedChat("")} />
        {
            !selectedChat.isGroupChat ? (
                <>
                {getSender(user,selectedChat.users)}
                <ProfileModel user={getSenderFull(user,selectedChat.users)} />
                </>
            ):(
                <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} />
                </>
            )
        }
    </Text>
    <Box display='flex' flexDir='column' justifyContent='flex-end' p={3} bg='#E8E8E8' w='100%' h='100%' borderRadius='lg' overflowY='hidden' >
        {
        loading?
        (<Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />):
        (
            <div className='messages' >
                <ScrollableChat messages={messages} />
            </div>
        )
        }
        <FormControl onKeyDown={sendMessage} isRequired mt={3} >
        {isTyping ? <Lottie options={defaultOptions} width={70} style={{marginBottom:15,marginLeft:0}} />:""}
            <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message..." onChange={typingHandler} value={newMessage}/>
        </FormControl>
    </Box>
    </>:(
        <Box display='flex' justifyItems='center' alignItems='center' h='100%' >
            <Text fontSize='3xl'pb={3} fontFamily='Work sans'>
                Click on user to start chatting
            </Text>
        </Box>
    )}
    </>
  )
}

export default SingleChat
