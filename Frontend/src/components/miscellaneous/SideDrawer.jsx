import React, { useState } from 'react'
import { Avatar, Box, Button, Input, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, Toast, useToast } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from "../../Context/ChatProvider"
import ProfileModel from './ProfileModel'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@chakra-ui/hooks'
import ChatLoading from '../ChatLoading'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import { Spinner } from '@chakra-ui/spinner'
import { color } from 'framer-motion'
import { getSender } from '../../config/chatLogics'
import { Badge } from 'antd'
import { MailOutlined } from '@ant-design/icons';

const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)
  const toast = useToast()

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
  let navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate("/api/user/login")
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in the search",
        status: 'warning',
        duration: 5000, isClosable: true,
        position: "top-left"
      })
      return;
    }
    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get(`http://localhost:8080/api/user?search=${search}`, config)
      // console.log(`Data1 : ${data}`);

      setLoading(false)
      setSearchResult(data)
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load the search results",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }

  // console.log(notification);


  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      }

      const { data } = await axios.post("http://localhost:8080/api/chat", { userId }, config)
      // console.log(data);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
      setSelectedChat(data)
      setLoadingChat(false)
      onClose()
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

  return (
    <>
      <Box display='flex' justifyContent='space-between' alignItems='center' bg='white' w='100%' p='5px 10px 5px 10px' borderWidth='5px' >
        <Tooltip label="Search users to chat" hasArrow placement='bottom-end' >
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text d={{ base: 'none', md: 'flex' }} px='4'>Search user</Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily='Work-sans'>
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1} >
              <Badge count={notification.length}>
                <MailOutlined style={{ fontSize: 24 }} />
              </Badge>
              <BellIcon fontSize='2xl' m={1} />
            </MenuButton>
            <MenuList pl={4} >
              {!notification?.length && <p style={{ color: "red" }} >No new messages</p>}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} >
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display='flex' pb={2}>
              <Input placeholder='Search by name or email' mr={2} value={search} onChange={(e) => setSearch(e.target.value)} />
              <Button onClick={handleSearch}>Go</Button>
            </Box>

            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml='auto' display='flex' />}
          </DrawerBody>
        </DrawerContent>

      </Drawer>
    </>
  )
}

export default SideDrawer
