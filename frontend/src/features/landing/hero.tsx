import React from 'react';
import styled from '@emotion/styled';
import { Box, Heading, Text, Button, Stack, Container } from '@chakra-ui/react';
import {
  BorderRadius,
  Colors,
  Fontsize,
  ShadowDark,
  ShadowLight,
  Spacing,
} from '../constants';
import CesiumGlobe from './cesium/cesium.globe';

export default function Hero() {
  return (
    <HeroContainer>
      <CesiumGlobe
        className="cesium-globe"
        // markers={[
        //   { id: 'mnl', lat: 14.5995, lon: 120.9842, label: 'Manila' },
        // ]}
      />

      <Box className="interface">
        <Box className="safezone">
          <div></div>
          <div></div>
          <div></div>
        </Box>
        <Box className="content">
          <Box className="float-cta">
            <Box className="heading-container">
              <Heading
                as="h1"
                className="heading"
                fontSize={{ base: '4xl', sm: '3xl', md: '4xl', lg: '5xl' }}
                fontWeight="extrabold"
                mb={4}
              >
                Find Your Perfect Boarding House
              </Heading>
              <Text
                className="subheading"
                as="p"
                fontSize={{ base: 'xl', sm: 'lg', md: 'xl' }}
              >
                Discover safe, affordable, and convenient boarding houses near
                you. Start your search now!
              </Text>
            </Box>
            <Stack
              className="button-container"
              direction={{ base: 'row', sm: 'column' }}
            >
              <Button
                style={{
                  backgroundColor: Colors.PrimaryLight[6],
                  color: Colors.TextInverse[1],
                }}
                size="lg"
              >
                Download the App
              </Button>
              <Button
                style={{
                  backgroundColor: Colors.PrimaryLight[4],
                  color: Colors.TextInverse[1],
                }}
                size="lg"
              >
                Read the Docs
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </HeroContainer>
  );
}

const HeroContainer = styled.div`
  height: 92dvh;
  min-height: 92dvh;
  position: relative;
  pointer-events: auto;
  width: 100%;
  box-shadow: ${ShadowDark.xxl};
  padding: 0;

  > .cesium-globe {
    position: absolute;
    width: 100%;
    z-index: 0;
  }

  > .interface {
    position: absolute;
    inset: 0;
    z-index: 10;
    pointer-events: none;

    padding: 0;

    > .safezone {
      width: 100%;
      height: 100%;
      position: absolute;
      inset: 0;

      > * {
        pointer-events: auto;
        position: absolute;
        background-color: transparent !important;
        /* display: none; */
      }

      > div:nth-of-type(1) {
        width: 50%;
        height: 100%;
        top: 0%;
        left: 0%;
        background-color: #61af22;

        @media (max-width: 768px) {
          display: none;
          width: 30%;
          height: 100%;
        }
      }
      > div:nth-of-type(2) {
        width: 100%;
        height: 10%;
        top: 0%;
        left: 0%;
        background-color: green;

        @media (max-width: 768px) {
          width: 100%;
          height: 10%;
        }
      }
      > div:nth-of-type(3) {
        width: 100%;
        height: 30%;
        bottom: 0%;
        left: 0%;
        background-color: green;

        @media (max-width: 768px) {
          width: 100%;
          height: 45%;
        }
      }
    }

    > .content {
      padding: ${Spacing.lg};
      width: 100%;
      height: 100%;
      position: absolute;

      > .float-cta {
        position: absolute;
        bottom: 50%;
        left: 3%;
        transform: translateY(50%);
        background-color: color-mix(
          in srgb,
          ${Colors.PrimaryLight[3]} 30%,
          transparent
        );
        backdrop-filter: blur(10px);
        width: 40%;
        height: 80%;
        display: flex;
        flex-direction: column;
        border-radius: ${BorderRadius.lg};

        box-shadow: ${ShadowLight.lg};

        @media (max-width: 768px) {
          padding: ${Spacing.lg} ${Spacing.lg} ${Spacing.lg} 0;
          background-color: transparent;
          backdrop-filter: none;
          width: 100%;
          height: 100%;
          left: 0%;
          border-radius: 0;
        }

        > .heading-container {
          padding: 1rem;
          height: auto;

          > .heading {
            height: auto;
            margin-bottom: ${Spacing.lg};
            color: ${Colors.TextInverse[1]};
            font-size: ${Fontsize.h1};
            font-weight: 900;
            line-height: ${Spacing.section};
            max-width: 15ch;
          }
          > .subheading {
            font-weight: 900;
            color: ${Colors.TextInverse[1]};
            max-width: 25ch;
            height: auto;

            @media (max-width: 768px) {
              font-weight: 600;
              line-height: ${Spacing.xl};
            }
          }

          @media (max-width: 768px) {
            align-self: flex-start;
            box-shadow: ${ShadowLight.xxl};
            margin: auto ${Spacing.lg} ${Spacing.lg} ${Spacing.lg};
            width: auto;
            border-radius: ${BorderRadius.lg};
            backdrop-filter: blur(10px);
            background-color: ${Colors.PrimaryLight[6]};
          }
        }

        > .button-container {
          padding: ${Spacing.lg};
          margin-top: auto;

          height: auto;

          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: ${Spacing.lg};

          > * {
          }

          @media (max-width: 768px) {
            margin-top: 0;
            > * {
              box-shadow: ${ShadowLight.xxl};
            }
          }
        }
      }
    }
  }
`;
