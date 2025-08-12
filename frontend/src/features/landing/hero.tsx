import React from 'react';
import styled from '@emotion/styled';
import { Box, Heading, Text, Button, Stack, Container } from '@chakra-ui/react';
import { BorderRadius, Colors, ShadowDark } from '../constants';
import Hero3D from './three/hero3D';

export default function Hero() {
  return (
    <HeroContainer>
      <Container
        className="container"
        py={{ base: 16, md: 24 }}
        px={{ base: 4, md: 8 }}
      >
        <Box className="box">
          <Heading
            as="h1"
            fontSize={{ base: '4xl', md: '6xl' }}
            fontWeight="extrabold"
            lineHeight="1.1"
            letterSpacing="-0.02em"
            mb={4}
          >
            Find Your Perfect Boarding House
          </Heading>
          <Text
            as="p"
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            mb={8}
            lineHeight="1.6"
          >
            Discover safe, affordable, and convenient boarding houses near you.
            Start your search now!
          </Text>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            justifyContent="center"
          >
            <Button colorScheme="teal" size="lg">
              Download the App
            </Button>
          </Stack>
        </Box>
        <Hero3D className="hero3D" />
      </Container>
    </HeroContainer>
  );
}

const HeroContainer = styled.div`
  height: 92dvh;
  min-height: 92dvh;
  display: flex;

  > .container {
    /* background-color: ${Colors.PrimaryLight[7]}; */
    background-image: linear-gradient(
      to left,
      ${Colors.PrimaryLight[8]},
      ${Colors.PrimaryLight[5]},
      ${Colors.PrimaryLight[4]},
      ${Colors.PrimaryLight[5]},
      ${Colors.PrimaryLight[8]},
      ${Colors.PrimaryLight[9]},
      ${Colors.PrimaryLight[9]},
      ${Colors.PrimaryLight[9]}
    );
    height: 100%;
    max-width: 100% !important;
    width: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
    gap: 1rem;

    > * {
      /* border: 1px solid white; */
    }

    > .box {
      border: 1px solid white;
      background-color: color-mix(
        in srgb,
        black 50%,
        ${Colors.PrimaryLight[7]} 50%
      );
      border-radius: ${BorderRadius.xl};
      box-shadow: ${ShadowDark.xl};
      backdrop-filter: blur(100px);
      width: 45%;
      height: 100%;
      padding: 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;

      > p {
        color: ${Colors.TextInverse[2]};
      }
    }

    > .hero3D {
      flex: 1 1 50%;
      height: 100%;
    }
  }
  @media (max-width: 768px) {
    height: auto;
    min-height: auto;

    > .container {
      > .box {
        background-color: color-mix(
          in srgb,
          black 20%,
          ${Colors.PrimaryLight[7]} 50%
        );
        backdrop-filter: blur(10px);
      }
      background-image:
        radial-gradient(
          circle 32px at 53px 56px,
          rgba(225, 225, 225, 0.8),
          transparent
        ),
        radial-gradient(
          circle at 30% 30%,
          ${Colors.PrimaryLight[9]},
          ${Colors.PrimaryLight[6]},
          ${Colors.PrimaryLight[3]},
          ${Colors.PrimaryLight[3]},
          ${Colors.PrimaryLight[2]},
          ${Colors.PrimaryLight[5]},
          ${Colors.PrimaryLight[9]}
        );

      flex-direction: column;
      > .box {
        width: 100%;
      }
      > .hero3D {
        /* border: 1px solid red; */
        /* width: 100%; */
      }
    }
  }
`;
