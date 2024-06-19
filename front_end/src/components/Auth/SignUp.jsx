import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import { Input ,InputGroup,InputRightElement} from '@chakra-ui/input'
import { FormControl,FormLabel } from '@chakra-ui/form-control'
import {
  VStack,Button,useToast
  } from '@chakra-ui/react'

function SignUp() {
  
  //api url
  const api_url ="http://192.168.1.12:5000"

  //state
  const [show, setshow] = useState(false)
  const [name, setname] = useState()
  const [email, setemail] = useState()
  const [password, setpassword] = useState()
  const [confirmpassword, setconfirmpassword] = useState()
  const [image, setimage] = useState()
  const [loading, setloading] = useState(false)
  const navigate = useNavigate()
  

  const toast = useToast()

  //methods
  const showClick = ()=>setshow(!show)
  const postDetail = (img)=>{
    setloading(true) 
    if(img === undefined){
      toast({
        title: 'Please select an image !',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      return;
    } 
    if(img.type === "image/jpeg" || img.type === "image/png"){
      const data = new FormData();
      data.append("file",img)
      data.append('upload_preset','chat-app')
      data.append('cloud_name','duvgzpcgn')
      fetch('https://api.cloudinary.com/v1_1/duvgzpcgn/image/upload',{
        method:'post',body:data
      }).then((res)=>res.json()).then(data=>{
        setimage(data.url.toString())
        console.log(data.url.toString())
        setloading(false)
      }).catch((err)=>{
        console.log(err)
        setloading(false)
      })
    } else{
      toast({
        title: 'Please select an image !',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      setloading(false)
      return;
    }
  }

  const submit = async ()=>{
    setloading(true)
    if(!name || !email || !password || !confirmpassword){
      toast({
        title: 'Please enter all field required !',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      setloading(false)
      return;
    }
    if( password !== confirmpassword){
      toast({
        title: 'Password Do not match !',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      setloading(false)
      return;
    }
    try {
      const config = {
        headers : {
          "content-type":"application/json"
        }
      };
      const {data} = await axios.post(
        api_url + "/api/user",
        {name,email,password,image},
        config);
      toast({
        title: 'register Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      localStorage.setItem("user_info",JSON.stringify(data))
      setloading(false)
      navigate("/")
    } catch (error) {
      toast({
        title: '  Error!!!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:'bottom'
      })
      
      setloading(false)
    }
  }

  //body
  return (
    <VStack
      spacing="5px" 
    >
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input 
          placeholder="Enter your Name"
          focusBorderColor="green.200"
          onChange={(e)=>setname(e.target.value)}
             />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input 
          placeholder="Enter your email"
          focusBorderColor="green.200"
          onChange={(e)=>setemail(e.target.value)}
             />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input 
            
            placeholder="Enter your Password"
            type={show ? "text" : "password"}
            focusBorderColor="green.200"
            onChange={(e)=>setpassword(e.target.value)}
               />
          <InputRightElement width="4.5rem">
            <Button p={2} h="1.75rem" size="5m" onClick={showClick}>
                {show ? 'Hide ':'show'}
            </Button>
          </InputRightElement>
          
        </InputGroup>
      </FormControl>


      <FormControl id="confirm_password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input 
            
            placeholder="Confirm your Password"
            type={show ? "text" : "password"}
            focusBorderColor="green.200"
            onChange={(e)=>setconfirmpassword(e.target.value)}
               />
          <InputRightElement width="4.5rem">
            <Button p={2} h="1.75rem" size="5m" onClick={showClick}>
                {show ? 'Hide ':'show'}
            </Button>
          </InputRightElement>
          
        </InputGroup>
      </FormControl>

      <FormControl id="name" >
        <FormLabel>Image</FormLabel>
        <Input 
          type="file"
          p={1.5}
          accept="image/*"
          focusBorderColor="green.200"
          onChange={(e)=>postDetail(e.target.files[0])}
             />
      </FormControl>

      <Button
        colorScheme="green" 
        width="100%"
        onClick={submit}
        style={{marginTop : 15,marginBottom:5}}
        isLoading={loading}
        >
        Sign Up
      </Button>
    </VStack>
  )
}

export default SignUp