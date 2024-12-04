import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box, Text, Stack, useToast } from '@chakra-ui/react'
import { Button } from '@chakra-ui/button'
import axios from 'axios'
import { AddIcon } from '@chakra-ui/icons'
import { getSender, getSenderFull } from '../../config/chatLogics'
import ChatLoading from '../ChatLoading'
import GroupChatModal from './GroupChatModal'
import { Avatar, AvatarBadge,  defineStyle } from '@chakra-ui/react'


const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()

  const { selectedChat, setSelectedChat, user, chats, setChats, activeUsers ,notification,setNotification} = ChatState()
  // console.log(activeUsers);

  const toast = useToast()
  // console.log(user);
  // console.log(chats);

  //Formating time
  function formatTime(isoString) {
    const date = new Date(isoString);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  const isUserActive = (userId) => activeUsers.includes(userId);

  const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "green.500",
    outlineOffset: "2px",
    outlineStyle: "solid",
  })

  // console.log(notification);
  
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get("http://localhost:8080/api/chat", config)
      // console.log(data);

      setChats(data)
    } catch (error) {
      toast({
        title: "Error fetching chat",
        description: error.message,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats()
  }, [fetchAgain])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir='column'
      alignItems='center'
      p={3}
      bg='white'
      w={{ base: '100%', md: '31%' }}
      borderRadius='lg'
      borderWidth='1px'
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "18px", md: "22px" }}
        fontFamily='Work sans'
        display='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'
      >
        My Chats
        <GroupChatModal>
          <Button display='flex' color="white" background="purple" fontSize={{ base: "17px", md: "10px", lg: "17px" }} rightIcon={<AddIcon />} >New Group chat</Button>
        </GroupChatModal>
      </Box>
      <Box display='flex' flexDir='column' p={3} bg='#F8F8F8' w='100%' h='100%' borderRadius='lg' overflowY='hidden' >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => (

              <Box
                onClick={() =>{ setSelectedChat(chat) ;setNotification(notification.filter((notif)=>notif.chat._id!==chat._id))}}
                cursor='pointer'
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text >
                  <Avatar size='sm' mr='12px' mb='6px' src={!chat.isGroupChat ? getSenderFull(loggedUser, chat.users).pic : "https://tse1.mm.bing.net/th?id=OIP.ufKuaEnVkQvHMnQlUOEHywHaHa&pid=Api&P=0&h=180"} >
                    <AvatarBadge
                      size='sm'
                      boxSize='1.05em'
                      bg={
                        chat.isGroupChat
                          ? 'green.500' // For group chats
                          : isUserActive(getSenderFull(user, chat.users)?._id)
                            ? 'green.500'
                            : 'red.500'
                      }
                    />

                  </Avatar>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                </Text>

                <h6 style={{ color: "black" }} >{chat.latestMessage?.content ? <p style={{ color: "maroon", fontSize: "12px", fontWeight: "bold" }}>{chat.latestMessage?.content}  ({formatTime(chat.latestMessage.createdAt)})</p> : ""} </h6>

              </Box>
            ))}
          </Stack>
        ) : <ChatLoading />}
      </Box>
    </Box>
  )
}

export default MyChats
