import React, { useState } from 'react'
import { useDisclosure } from '@chakra-ui/hooks'
import { IconButton } from '@chakra-ui/button'
import { ViewIcon } from '@chakra-ui/icons'
import { Modal, ModalBody, ModalCloseButton,Box,Button, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast, FormControl, Input, Spinner } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import UserListItem from '../UserAvatar/UserListItem'
import axios from 'axios'

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const{isOpen,onOpen,onClose}=useDisclosure()
    const[groupChatName,setGroupChatName]=useState()
    const{selectedChat,setSelectedChat,user}=ChatState()
    const[search,setSearch]=useState()
    const[searchResult,setSearchResult]=useState([])
    const[loading,setLoading]=useState(false)
    const[renameLoading,setRenameLoading]=useState(false)
    const toast = useToast()

    const handleAddUser=async(user1)=>{
        if(selectedChat.users.find((u)=>u._id===user1._id)){
            toast({
                title:"User already in the group",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return;
        }
        if(selectedChat.groupAdmin._id!==user._id){
            toast({
                status:"error",
                title:"Only group admins can add someone!",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const{data}=await axios.put("http://localhost:8080/api/chat/groupadd",{
                chatId:selectedChat._id,
                userId:user1._id
            },config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title:"Error occured",
                description:error.response.data.message,
                duration:5000,
                status:"error",
                isClosable:true,
                position:"bottom"
            })
            setLoading(false)
        }finally {
            setLoading(false);
        }
    }

    const handleRemove = async(user1)=>{
        if(selectedChat.groupAdmin._id!==user._id && user1._id!==user._id){
            toast({
                title:"Only group admins can remove someone!",
                duration:5000,
                status:"error",
                isClosable:true,
                position:"bottom"
            })
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const{data}=await axios.put(`http://localhost:8080/api/chat/groupremove`,{
                chatId:selectedChat._id,
                userId:user1._id
            },config)
            user1._id===user._id?setSelectedChat():setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
        } catch (error) {
            toast({
                title:"Error occured",
                description:error.response.data.message,
                duration:5000,
                status:"error",
                isClosable:true,
                position:"bottom"
            })
            setLoading(false)
        }finally {
            setLoading(false);
        }
    }

    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query){
            return;
        }
        try {
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data} = await axios.get(`http://localhost:8080/api/user?search=${search}`,config)
            // console.log(data);
            setLoading(false)
            setSearchResult(data)
        } catch (error) {
            toast({
                title:"Error occured",
                description:"Failed to load search results",
                sstatus:"error",
                duration:5000,
                isClosable:true,
                position:"bottom-left"
            })
            setLoading(false)
        }
    }

    const handleRename = async()=>{
    
        if(!groupChatName)return
        try {
            setRenameLoading(true)
            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const{data}=await axios.put("http://localhost:8080/api/chat/rename",
                {
                    chatId:selectedChat._id,
                    chatName:groupChatName
                },
                config
            )
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title:'Error occured',
                description:error.response.data.message,
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            setRenameLoading(false)
        }
        setGroupChatName("")
    }
  return (
    <>
    <IconButton display={{base:'flex'}} icon={<ViewIcon/>} onClick={onOpen} />
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader 
            fontSize='35px'
            fontFamily='Work sans' 
            display='flex' justifyContent='center'
            >{selectedChat.chatName}</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
                <Box display='flex' flexWrap='wrap' pb={3} w='100%'>
                    {selectedChat.users.map((u)=>(
                        <UserBadgeItem key={u._id} user={u} handleFunction={()=>handleRemove(u)} />
                    ))}
                </Box>
                <FormControl display='flex' >
                    <Input placeholder='Chat name' value={groupChatName} mb={3} onChange={(e)=>setGroupChatName(e.target.value)} />
                    <Button variant='solid' colorScheme='teal' ml={1} isLoading={renameLoading} onClick={handleRename} >
                        Update 
                    </Button>
                </FormControl>
                <FormControl display='flex' >
                    <Input placeholder='Add users to group' mb={1} onChange={(e)=>handleSearch(e.target.value)} />
                    
                </FormControl>
                {loading?(
                    <Spinner size='lg' />
                ):(
                    Array.isArray(searchResult) && searchResult.map((user) => (
                        <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                    ))
                )}
            </ModalBody>

            <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={()=>handleRemove(user)} >
                    Leave group
                </Button>
                
            </ModalFooter>
        </ModalContent>

    </Modal>
    </>
  )
}

export default UpdateGroupChatModal
