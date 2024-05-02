import React from 'react';
import { Footer } from './Footer';
import Header from './Header';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { Grid } from '@mui/material';
import image1 from '../assets/apod.jpg';
import image2 from '../assets/NASA_Mars_Rover.jpg';
import { AuthContext } from '../auth/AuthProvide';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleMarsClick = () => {
    navigate('/user/marsfeed');
  };

  const handleApodClick = () => {
    navigate('/user/feed');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: '0 0 auto', backgroundColor: '#f0f0f0' }}>
        <Header />
      </Box>
      <Box
        sx={{
          flex: '1 0 auto',
          padding: '20px',
          textAlign: 'center',
          paddingTop: 10,
          paddingBottom: 20,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            paddingBottom: 10,
            fontWeight: 'bold',
            fontStyle: 'italic',
            backgroundImage: `linear-gradient(45deg, #5514B4, #F6635C)`,
            backgroundSize: '100%',
            backgroundRepeat: 'repeat',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Explore the cosmos beyond our solar system <br />& unlock the wonders
          of the universe
        </Typography>
        <Grid container spacing={7} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={user ? handleApodClick : undefined}>
                <CardMedia
                  component="img"
                  height="140"
                  image={image1}
                  alt="Astronomy Picture of the Day"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Astronomy Picture of the Day
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'justify' }}
                  >
                    Astronomy Picture of the Day (APOD) is a NASA initiative
                    that brings stunning images of our universe to your
                    fingertips every day. Explore captivating photos of
                    galaxies, nebulae, planets, and more, accompanied by
                    informative descriptions that unravel the mysteries of our
                    cosmos.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={user ? handleMarsClick : undefined}>
                <CardMedia
                  component="img"
                  height="140"
                  image={image2}
                  alt="Mars Rover Photos"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Mars Rover Photos
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'justify' }}
                  >
                    Mars Rover Photos is an exciting project by NASA that
                    provides a glimpse into the Martian landscape through the
                    eyes of various rovers exploring the Red Planet. Delve into
                    a collection of stunning images captured by these robotic
                    explorers, showcasing Mars' rugged terrain, ancient
                    geological features, and potential sites of scientific
                    interest.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          flex: '0 0 auto',
          margin: '0 -10px -10px',
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
}
