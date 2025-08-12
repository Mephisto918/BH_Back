import React from 'react';
import styled from '@emotion/styled';
import { Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { techStackJson } from './techStachArray';
import Icon from 'tech-stack-icons';
import { Colors, ShadowDark, Spacing } from '../constants';

export default function TechStack() {
  return (
    <Section>
      <Stack className="stack">
        <Stack className="heading-container">
          <Heading className="heading" size="xl">
            Powered By
          </Heading>
          <Text className="subheading" fontSize="lg" color="gray.500">
            Behind BH Hunter is a rock-solid, opinionated stack that scales as
            fast as your ambitions.
          </Text>
        </Stack>
        <HStack className="stack-container">
          <Stack className="stack-row">
            {techStackJson.map((tech, index) => (
              <a
                key={index}
                className="item-container"
                href={tech.link}
                // style={{ marginLeft: index === 0 ? 0 : "auto" }}
              >
                <Icon className="icon" name={tech.logo} />
                <Text
                  mt={3}
                  fontWeight="semibold"
                  fontSize="lg"
                  color={Colors.TextInverse[1]}
                >
                  {tech.name}
                </Text>
                {tech.description && (
                  <Text
                    mt={1}
                    fontSize="sm"
                    color={Colors.TextInverse[2]}
                    lineHeight="tall"
                  >
                    {tech.description}
                  </Text>
                )}
              </a>
            ))}
          </Stack>
        </HStack>
      </Stack>
    </Section>
  );
}

const Section = styled.section`
  background-color: #f5f5f5;
  padding: 3rem 1rem;
  text-align: center;

  > .stack {
    > .heading-container {
      gap: 0;
      > .heading {
        display: inline-block;
        color: ${Colors.PrimaryLight[6]};
        /* font-size: 3.5rem; */
        font-weight: 900;
      }
      > .subheading {
        color: ${Colors.Text[1]};
      }
    }

    > .stack-container {
      display: flex;
      flex-direction: row;
      justify-content: center;

      > .stack-row {
        border: 1px solid green;
        display: flex;
        flex-direction: row;
        overflow: auto;
        flex-wrap: nowrap;
        flex-shrink: 0;

        max-width: 100%;
        padding: 0 0 2rem 0;
        gap: ${Spacing.lg};

        ::-webkit-scrollbar {
          display: none;
        }

        > .item-container {
          flex: 0 0 auto;
          width: 180px;
          border-radius: 12px;
          padding: 1rem;
          transition: box-shadow 0.3s ease;
          background: ${Colors.PrimaryLight[6]};

          box-shadow: ${ShadowDark.xxl};

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

  /* Tablet */
  @media screen and (min-width: 400px) {
    .heading {
      font-size: 2.3rem;
      /* border: 2px solid green; */
    }
    .stack-row {
      justify-content: flex-start;
    }
  }

  @media screen and (min-width: 768px) {
    .heading {
      font-size: 2.3rem;
      /* border: 2px solid green; */
    }
    .stack-row {
      justify-content: flex-start;
    }
  }

  /* Small desktop */
  @media screen and (min-width: 1024px) {
    .heading {
      font-size: 3rem;
      /* border: 2px solid green; */
    }
    .stack-row {
      /* justify-content: flex-start;
      padding-left: 1rem;
      padding-right: 1rem; */
    }
  }

  /* Large desktop / Ultra-wide */
  @media screen and (min-width: 1440px) {
    .heading {
      font-size: 4rem;
      /* border: 2px solid yellow; */
    }
    .stack-row {
      justify-content: space-between;
      padding-left: 1rem;
      padding-right: 1rem;
    }
  }
`;
