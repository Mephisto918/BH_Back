import React from 'react';
import styled from '@emotion/styled';
import { Box, Heading, Stack, Text } from '@chakra-ui/react';
import { techStackJson } from './techStachArray';
import Icon from 'tech-stack-icons';
import { Colors } from '../constants';

export default function TechStack() {
  return (
    <Section>
      <Stack className="stack" spacing={8} align="center">
        <Heading className="heading" as="h2" size="xl" mb={6}>
          Powered By:
        </Heading>
        <Box className="box">
          <Stack
            direction="row"
            spacing={8}
            justify="center"
            wrap="wrap"
            className="stack-row"
          >
            {techStackJson.map((tech, index) => (
              <Box
                key={index}
                className="item-container"
                textAlign="center"
                maxW="180px"
              >
                <Icon className="icon" name={tech.logo} />
                <Text mt={3} fontWeight="semibold" fontSize="lg" color={Colors.TextInverse[1]}>
                  {tech.name}
                </Text>
                {tech.description && (
                  <Text mt={1} fontSize="sm" color={Colors.TextInverse[2]} lineHeight="tall">
                    {tech.description}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Section>
  );
}

const Section = styled.section`
  background-color: #f5f5f5;
  padding: 3rem 1rem;
  text-align: center;

  > .stack {
    > .heading {
      /* border: 2px solid black; */
      padding: 0.5rem 1rem;
      display: inline-block;
      margin-bottom: 1rem;
      color: ${Colors.TextInverse[6]};
    }

    > .box {
      > .stack-row {
        > .item-container {
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 1rem;
          transition: box-shadow 0.3s ease;
          background: ${Colors.PrimaryLight[6]};
          
          &:hover {
            background: ${Colors.PrimaryLight[5]};
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          }

          > .icon {
            /* border: 2px solid yellow; */
            aspect-ratio: 1;
            height: 100px;
            margin: 0 auto;
            display: block;
          }

          > p,
          > span {
            margin-top: 0.5rem;
          }
        }
      }
    }
  }
`;
