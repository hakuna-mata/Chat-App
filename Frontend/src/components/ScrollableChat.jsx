import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/chatLogics";
import { Avatar, Tooltip, Button, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const ScrollableChat = ({ messages }) => {
  const { user, selectedChat } = ChatState();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMsgId, setSelectedMsgId] = useState(null);
  const cancelRef = React.useRef();

  const handleDeleteConfirmation = (id) => {
    setSelectedMsgId(id);  
    setIsDialogOpen(true); 
  };

  const deleteMsg = async () => {
    try {
        setIsLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      queryClient.setQueryData(["messages", selectedChat?._id], (oldMessages = []) =>
        oldMessages.filter((msg) => msg._id !== selectedMsgId)
      );

      await axios.delete(`http://localhost:8080/api/message/${selectedMsgId}`, config);

      setIsDialogOpen(false);
      setSelectedMsgId(null);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }finally{
        setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxHeight: "400px",
        overflowY: "auto",
      }}
    >
      <ScrollableFeed>
        {messages &&
          messages.map((m, i) => (
            <div style={{ display: "flex" }} key={m._id}>
              {/* Avatar */}
              {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                  <Avatar mt="7px" mr={1} size="sm" cursor="pointer" name={m.sender.name} src={m.sender.pic} />
                </Tooltip>
              )}

             
              <span
                onDoubleClick={() => handleDeleteConfirmation(m._id)}
                style={{
                  backgroundColor: `${m.sender._id === user._id ? "hotpink" : "yellow"}`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, m, i, user._id),
                  marginTop: isSameUser(messages, m, i, user._id) ? 5 : 7,
                  cursor: "pointer", 
                }}
              >
                
                <div>{m.content}</div>
                <div style={{ fontSize: "0.8em", color: "black" }}>
                  {new Date(m.createdAt).toLocaleTimeString()}
                </div>
              </span>
            </div>
          ))}
      </ScrollableFeed>

     
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Are you sure you want to delete this message? 
            </AlertDialogHeader>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={deleteMsg} ml={3}  isLoading={isLoading}  loadingText="Deleting..." spinnerPlacement="start">
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
};

export default ScrollableChat;
