import { Colors } from '@/features/constants';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
  useColorMode,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import React from 'react';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  children: React.ReactNode;
}

export default function ModalWrapper({
  isOpen,
  onClose,
  closeOnOverlayClick,
  closeOnEsc,
  children,
}: ModalWrapperProps) {
  const { colorMode } = useColorMode();

  const dynamicHeight = useBreakpointValue({
    base: '60vh', // mobile
    md: '70vh', // tablets
    lg: '85vh', // desktops
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      isCentered
      closeOnOverlayClick={closeOnOverlayClick}
      closeOnEsc={closeOnEsc}
    >
      <ModalOverlay />
      {/* <ModalContent> */}
      <FloatingModalContent
        colorMode={colorMode}
        modalHeight={dynamicHeight}
        maxH="90vh"
        minH="60vh"
      >
        <ModalCloseButton />
        <ModalBody display="flex" flex="1" p={0}>
          {children}
        </ModalBody>
      </FloatingModalContent>
    </Modal>
  );
}

const FloatingModalContent = styled(ModalContent, {
  shouldForwardProp: (prop) => prop !== 'colorMode' && prop !== 'modalHeight',
})<{ colorMode: string; modalHeight?: string | number }>`
  height: ${({ modalHeight }) => modalHeight || '85vh'};
  min-width: 90%;
  max-width: 90%;
  border-radius: 1rem;
  /* overflow: scroll; */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  background-color: ${({ colorMode }) =>
    colorMode === 'light'
      ? Colors.PrimaryLight[4]
      : Colors.PrimaryLight[8]} !important;

  > :nth-of-type(1) {
    padding: 1rem;
    > :nth-of-type(1) {
    }
  }

  /* ----------------- RESPONSIVE BREAKPOINTS ----------------- */
  @media (max-width: 768px) {
    /* Mobile/tablet layout: stack PDF and details vertically */
    min-width: 95%; /* override if needed */
    max-width: 95%;
  }

  @media (max-width: 480px) {
    /* Small phones */
    min-width: 95%;
    max-width: 95%;
    border-radius: 0.5rem;
  }

  /* Optional: tablet / desktop tweaks */
  @media (min-width: 1200px) {
    max-width: 85%; /* optional wider modal for large screens */
  }
`;
