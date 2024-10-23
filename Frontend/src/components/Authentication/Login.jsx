import React,{useState} from 'react'
import { VStack } from '@chakra-ui/layout'
import { FormControl ,FormLabel} from '@chakra-ui/form-control'
import { Input,InputGroup,InputRightElement } from '@chakra-ui/input'
import { Button, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
    let[password,setPassword]=useState("")
    let[email,setEmail]=useState("")
    let[show,setShow]=useState(false)
    const[loading,setLoading]=useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    let handleClick = ()=>{
        setShow(!show)
    }

    
    const submitHandler = async(pics)=>{
        setLoading(true)
        if(!password||!email){
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
        try {
            const config = {
                headers:{
                    "content-type":"application/json"
                }
            }
            const{data}=await axios.post("http://localhost:8080/api/user/login",{email,password},config)
            toast({
                title: 'Login Successfull',
                description: 'Login Successfull',
                status: 'success',
                duration: 9000,
                isClosable: true,
                position:"bottom"
              })
              localStorage.setItem("userInfo",JSON.stringify(data))
              setLoading(false)
              navigate("/chats")
        } catch (err) {
            toast({
                title: 'Login failed',
                description: err.response.data.message,
                status: 'success',
                duration: 9000,
                isClosable: true,
                position:"bottom"
              })
              setLoading(false)
        }
    }

  return (
    <VStack spacing="5px">
        
        <FormControl id='emaill' isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter email' type='email' name='email' value={email} onChange={(e)=>setEmail(e.target.value)}  />
        </FormControl>
        <FormControl id='passwordd' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input placeholder='Enter password' type={show?"text":"password"} value={password} name='password' onChange={(e)=>setPassword(e.target.value)} />
            <InputRightElement width="4.5rem">

            <Button h="1.75rem" size="sm" onClick={handleClick} >
                {show?"Hide":"Show"}
            </Button>
            
            </InputRightElement>
            </InputGroup>
            
        </FormControl>

       

        <Button colorScheme='blue' width='100%' style={{marginTop:15}} isLoading={loading} onClick={submitHandler} >
            Login
        </Button>
        <Button variant='solid' colorScheme='red' width='100%' style={{marginTop:15}} onClick={()=>{setEmail("example@gmail.com") 
            setPassword("some secret")
        }} >
            Get user credentials
        </Button>
      </VStack>
  )
}

export default Login
