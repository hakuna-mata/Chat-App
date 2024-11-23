import React,{useState} from 'react'
import { VStack } from '@chakra-ui/layout'
import { FormControl ,FormLabel} from '@chakra-ui/form-control'
import { Input,InputGroup,InputRightElement } from '@chakra-ui/input'
import { Button, useToast } from '@chakra-ui/react'
import axios from "axios"
import {useNavigate} from "react-router-dom"

const Signup = () => {
    let[show,setShow]=useState(false)
   const[name,setName]=useState()
   const[email,setEmail]=useState()
   const[password,setPassword]=useState()
   const[confirmpassword,setConfirmpassword]=useState()
   const[pic,setPic]=useState()
   const[loading,setLoading]=useState(false)
   const toast = useToast()
   const navigate = useNavigate()

    const postDetails = (pics)=>{
        setLoading(true)
        if(pics===undefined){
            toast({
                title: 'Something went wrong',
                description: "Something went wrong",
                status: 'success',
                duration: 9000,
                isClosable: true,
                position:"bottom"
              })
              return;
        }
        
        if(pics.type==="image/jpeg" || pics.type==="image/png"){
            const data = new FormData()
            data.append("file",pics)
            data.append("upload_preset","chat-application")
            data.append("cloud_name","dm4kzpiro")
            fetch("https://api.cloudinary.com/v1_1/dm4kzpiro/image/upload",{
                method:"post",
                body:data
            }).then((res)=>res.json())
            .then((data) => {
                setPic(data.url.toString())
                // console.log(data);
                setLoading(false)
            })
            .catch((err)=>{
                console.log(err);
                setLoading(false)
                
            })
        }else{
            toast({
                title: 'Please select an image',
                description: 'Please select an image',
                status: 'success',
                duration: 9000,
                isClosable: true,
                position:"bottom"
              })
              setLoading(false)
              return
        }
    }
 
    let submitHandler = async()=>{
        setLoading(true)
        if(!name||!email||!password||!confirmpassword){
            toast({
                title: 'Please fill all the fields',
                description: 'Please fill all the fields',
                status: 'success',
                duration: 9000,
                isClosable: true,
                position:"bottom"
              })
              setLoading(false)
              return
        }
        if(password!==confirmpassword){
            toast({
                title: 'Password donot match',
                description: 'Password donot match',
                status: 'success',
                duration: 9000,
                isClosable: true,
                position:"bottom"
              })
              setLoading(false)
              return
        }
        try{
            const config = {
                headers:{
                    "Content-type":"application/json",
                }
            }
            const{data}=await axios.post("http://localhost:8080/api/user",{name,email,password,confirmpassword,pic},config)
            toast({
                title: 'Registration successfull',
                description: 'Registration successfull',
                status: 'success',
                duration: 9000,
                isClosable: true,
                position:"bottom"
              })
              localStorage.setItem("userInfo",JSON.stringify(data))
              setLoading(false)
              navigate("/chats")
        }catch(err){
            toast({
                title: 'Error occured',
                description: err.response.data.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
                position:"bottom"
              })
              setLoading(false)
              
        }
    }   

    let handleClick = ()=>{
        setShow(!show)
    }


  return (
 
      <VStack spacing="5px">
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter name'type='text' name='name' onChange={(e)=>setName(e.target.value)}  />
        </FormControl>
        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter email' type='email' name='email' onChange={(e)=>setEmail(e.target.value)}  />
        </FormControl>
        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input placeholder='Enter password' type={show?"text":"password"} name='password' onChange={(e)=>setPassword(e.target.value)}  />
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick} >
                {show?"Hide":"Show"}
            </Button>
            </InputRightElement>
            </InputGroup>
            
        </FormControl>

        <FormControl id='confirmpassword' isRequired>
            <FormLabel>Confirm-Password</FormLabel>
            <InputGroup>
            <Input placeholder='Enter Confirm-password' type={show?"text":"password"} name='confirmpassword' onChange={(e)=>setConfirmpassword(e.target.value)} />
            <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show?"Hide":"Show"}
            </Button>
            </InputRightElement>
            </InputGroup>
            
        </FormControl>

        <FormControl id='pic' isRequired>
            <FormLabel>Pic</FormLabel>
            <Input placeholder='Enter pic' p={1.5} accept='image/*' type='file' onChange={(e)=>postDetails(e.target.files[0])}/>
        </FormControl>

        <Button colorScheme='blue' width='100%' style={{marginTop:15}} onClick={submitHandler} isLoading={loading}  >
            Signup
        </Button>
      </VStack>
   
  )
}

export default Signup
