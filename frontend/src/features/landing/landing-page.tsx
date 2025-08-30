import styled from '@emotion/styled';
import { Box, Heading, Button, AspectRatio, Image } from '@chakra-ui/react';
import { Colors, Spacing } from '../constants';
import Hero from './hero';
import Footer from '../shared/layouts/ui/footer';
import Techstack from './techstack';
import { useTypedRootNavigation } from '@/app/navigation/RootNavHook';
import logoService from '@/assets/logo/logo.service';

export default function LandingPage() {
  const logo11 = logoService.getAsset('1:1', 'light', 128);
  const navigate = useTypedRootNavigation();

  return (
    <Container>
      <Box className="box">
        <nav>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <AspectRatio ratio={1} width="45px">
              <Image src={logo11} alt="Logo" objectFit="contain" />
            </AspectRatio>
            <Heading ml={3}>BH Hunter</Heading>
          </Box>

          <Box className="box">
            <Button
              className="button"
              onClick={() => {
                navigate('/auth/login');
              }}
            >
              Login as Admin
            </Button>
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
  > .box:nth-of-type(1) {
    padding: 1rem;
    /* border: 3px solid green; */

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
