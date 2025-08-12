import React from 'react';
import styled from '@emotion/styled';
import { Colors } from '@/features/constants'; 
import { Text } from '@chakra-ui/react';

export default function footer() {
  return (
    <Footer>
      <div>
        <header>BH Hunter</header>
      </div>
      <div>
        <Text>@ 2025 BH Hunter. All rights reserved.</Text>
      </div>
      <div>
        <Text>Privacy Policy</Text>
        <Text>Terms of Use</Text>
      </div>
    </Footer>
  );
}

const Footer = styled.footer`
  color: white;
  background-color: ${Colors.PrimaryLight[8]};

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0 2rem;
  align-items: center;
  margin-top: auto;
  height: 10rem;
`;
