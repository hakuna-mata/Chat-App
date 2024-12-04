import React from 'react'
import { Avatar,defineStyle,HStack } from '@chakra-ui/react'

const ringCss = defineStyle({
    outlineWidth: "2px",
    outlineColor: "green",
    outlineOffset: "2px",
    outlineStyle: "solid",
    marginRight:"8px"
  })

const Avtr = ({notif,handleFunction}) => {
  return (
    <>
    <HStack gap="3">
    <Avatar  key={notif._id} onClick={handleFunction} size='sm' cursor='pointer'
          name="Random"
          src={notif.sender.pic}
          css={ringCss}
        />
        </HStack>
    </>
  )
}

export default Avtr


 