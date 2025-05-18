import SetNightMode from "@/components/settings/SetNightMode";
import React, { useRef } from "react";
import { Flex, useDisclosure } from "@chakra-ui/react";
import Sidebar from "@/components/homepage/Sidebar";
import Nav from "@/components/homepage/Nav";
import DrawerComponent from "@/components/homepage/DrawerComponent";
import  EmailDisplay  from '@/components/EmailDisplay';

const SettingsPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  return (
    <>
      <Nav btnRef={btnRef} onOpen={onOpen} />
      <DrawerComponent isOpen={isOpen} onClose={onClose} btnRef={btnRef} />
      <Flex>
        {innerWidth > 700 && <Sidebar />}
        <div>
          <h2>Settings</h2>
          <EmailDisplay />
          <SetNightMode />
          {/* ...other settings components... */}
        </div>
      </Flex>
    </>
  );
};

export default SettingsPage;
