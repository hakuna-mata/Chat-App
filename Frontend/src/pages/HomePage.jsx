import React, { useEffect } from "react";
import { Container, Box, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react"
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
import ErrorFallback from "../components/miscellaneous/ErrorFallback";
import { ErrorBoundary } from 'react-error-boundary'

const HomePage = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))
        if (user) {
            navigate("/chats")
        }
    }, [navigate])
    return (
        <>
            <Container maxW="xl" centerContent >
                <Box
                    d="flex"
                    justifyContent="center"
                    p={3}
                    bg={"white"}
                    w="100%"
                    m="40px 0 15px 0"
                    borderRadius="lg"
                    borderWidth="1px"
                >
                    <Text fontSize='4xl' fontFamily="Work sans" color="black" textAlign="center" >Chat now</Text>
                </Box>
                <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" >
                    <Tabs variant='soft-rounded'>
                        <TabList mb="1em">
                            <Tab width="50%">Login</Tab>
                            <Tab width="50%">Signup</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <ErrorBoundary FallbackComponent={ErrorFallback}>
                                    <Login />
                                </ErrorBoundary>

                            </TabPanel>
                            <TabPanel>
                                <ErrorBoundary FallbackComponent={ErrorFallback}>
                                    <Signup />
                                </ErrorBoundary>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </Box>
            </Container>
        </>
    )
}

export default HomePage