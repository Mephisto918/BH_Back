import { Colors } from '@/features/constants';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorMode,
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import React from 'react';

interface DialogWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  dimension?: {
    width: string;
    height: string;
  };
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function DialogWrapper({
  isOpen,
  onClose,
  closeOnOverlayClick,
  closeOnEsc,
  dimension = { width: '50%', height: '55vh' },
  header,
  children,
  footer,
}: DialogWrapperProps) {
  const { colorMode } = useColorMode();

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
      <FloatingModalContent
        colorMode={colorMode}
        minH="25dvh"
        width={dimension.width}
        height={dimension.height}
      >
        {header && (
          <>
            <ModalHeader display={'flex'} justifyContent={'center'}>
              {header}
            </ModalHeader>
            <hr
              style={{
                borderTopWidth: '3px',
                borderTopColor:
                  colorMode === 'light'
                    ? Colors.PrimaryLight[7]
                    : Colors.PrimaryLight[5],
              }}
            ></hr>
          </>
        )}
        <ModalBody display="flex" flex="1" p={0}>
          {children}
        </ModalBody>
        {footer && (
          <>
            <hr
              style={{
                borderTopWidth: '3px',
                borderTopColor:
                  colorMode === 'light'
                    ? Colors.PrimaryLight[7]
                    : Colors.PrimaryLight[5],
              }}
            ></hr>
            <ModalFooter w="100%" justifyContent="center">
              {footer}
            </ModalFooter>
          </>
        )}
      </FloatingModalContent>
    </Modal>
  );
}

const FloatingModalContent = styled(ModalContent)<{
  colorMode: string;
  height: string | number;
  width: string;
}>`
  height: ${({ height }) => height || '85vh'};
  min-width: ${({ width }) => width || '85vh'};
  max-width: ${({ width }) => width || '85vh'};
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
