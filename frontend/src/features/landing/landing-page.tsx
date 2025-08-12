import styled from '@emotion/styled';
import { Box, Heading, Button } from '@chakra-ui/react';
import { Colors, Spacing } from '../constants';
import Hero from './hero';
import Footer from '../layouts/ui/footer';
import Techstack from './techstack';

export default function LandingPage() {
  return (
    <Container>
      <Box className="box">
        <nav>
          <Heading className="heading" as="h1" size="lg">
            BH Hunter
          </Heading>
          <Box className="box">
            <Button className="button">Login as Admin</Button>
          </Box>
        </nav>
      </Box>
      <Hero />
      <Techstack />
      <Footer></Footer>
    </Container>
  );
}

const Container = styled.div`
  color: ${Colors.TextInverse[2]};
  background-color: ${Colors.PrimaryLight[9]};

  min-height: 100vh; /* Take full viewport height */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-grow: 1;

  /* Content grows to fill the space pushing footer down */
  > .box:nth-child(1) {
    padding: 1rem;
    /* height: 8dvh; */
    /* border: 1px solid white; */

    > nav {
      background-color: ${Colors.PrimaryLight[9]};
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      > .box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        > .button {
          background-color: ${Colors.PrimaryLight[5]};
          color: ${Colors.TextInverse[1]};
        }
      }
    }
  }
`;
