import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast, Input,Box
} from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import { FormControl } from '@chakra-ui/form-control'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import ChatLoading from '../ChatLoading'

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  // console.log(searchResult);

  const { user, chats, setChats } = ChatState()

  const handleSearch = async (query) => {
    setSearch(query)
    if (!query) {
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
      // console.log("Data :" + data);

      setLoading(false)
      setSearchResult(data)
      // console.log(searchResult);

    } catch (error) {
      console.log(error.message);

      toast({
        title: "Error occured",
        description: "Failed to load search results",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
      })
    }
  }

  const handleDelete = (delUser)=>{
    setSelectedUsers(selectedUsers.filter((selUser)=>selUser._id!==delUser._id))
  }

  const handleSubmit = async() => {
    if(!groupChatName || !selectedUsers){
      toast({
        title:'Please fill all the fields',
        status:'warning',
        duration:5000,
        isClosable:true,
        position:"top"
      })
      return;
    }
    try {
      const config = {
        headers:{
          Authorization:`Bearer ${user.token}`,
        }
      }
      const{data}=await axios.post("http://localhost:8080/api/chat/group",{
        name:groupChatName,
        users:JSON.stringify(selectedUsers.map((user)=>user._id))
      },config)
      setChats([data,...chats])
      onClose()
      toast({
        title:"New group chat has been created",
        status:"success",
        duration:5000,
        isClosable:true,
        position:"top"
      })
    } catch (error) {
      toast({
        title:"Failed to create chat",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top"
      })
    }
   }

  const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
      toast({
        title:"User already added",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top"
      })
      return
    }
    setSelectedUsers([...selectedUsers,userToAdd])
   }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize='35px'
            fontFamily='Work sans'
            display='flex'
            justifyContent='center'
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody display='flex' flexDir='column' alignItems='center' >
            <FormControl>
              <Input placeholder='Chat name' mb={3} onChange={(e) => setGroupChatName(e.target.value)} />
            </FormControl>
            <FormControl>
              <Input placeholder='Add users eg:Virat,Rohit,Rahul' mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            
            <Box display='flex' w='100%' flexWrap='wrap' >
            {selectedUsers.map((u)=>(
              <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleDelete(u)} />
            ))}
            </Box>

            {loading ? (
              <ChatLoading/>
            ) : (
              Array.isArray(searchResult) &&
              searchResult.slice(0, 4).map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
              ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
