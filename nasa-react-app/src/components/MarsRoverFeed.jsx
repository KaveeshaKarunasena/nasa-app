import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Footer } from './Footer';
import Header from './Header';
import axios from 'axios';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Select,
} from '@mui/material';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';

export function MarsRoverFeed() {
  const { enqueueSnackbar } = useSnackbar();
  const [apiData, setApiData] = React.useState([]);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(null);
  const [selectedOption, setSelectedOption] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const currentDate = dayjs();
  const roverArray = ['Curiosity', 'Opportunity', 'Spirit'];

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const handleDateChange = newDate => {
    setSelectedDate(newDate);
  };

  const fetchData = async () => {
    if (!roverArray.includes(selectedOption)) {
      enqueueSnackbar('Select a valid rover type', { variant: 'error' });
    }

    if (!selectedDate) {
      enqueueSnackbar('Select a valid date', { variant: 'error' });
    }
    const apiKey = import.meta.env.VITE_NASA_API_KEY;
    const url =
      `https://api.nasa.gov/mars-photos/api/v1/rovers/${selectedOption}/photos` +
      `?earth_date=${selectedDate.format('YYYY-MM-DD')}` +
      `&api_key=${apiKey}`;
    await axios
      .get(url)
      .then(response => {
        if (response.data && response.data.photos.length > 0) {
          setApiData(response.data.photos);
        } else {
          console.log('Empty array returned from the API');
          setErrorMessage('No photos found for the provided details');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleClickOpen = index => {
    setSelectedImageIndex(index);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImageIndex(null);
  };

  const handleDropdownChange = event => {
    setSelectedOption(event.target.value);
  };

  const handleDownload = async imageUrl => {
    try {
      console.log(imageUrl);
      const response = await axios.get(
        `https://cosmiclens.onrender.com/download-image?imageUrl=${imageUrl}`,
        { responseType: 'blob' },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'MarsRoverimage.jpg');
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  React.useEffect(() => {
    const apiKey = import.meta.env.VITE_NASA_API_KEY;
    const url =
      `https://api.nasa.gov/mars-photos/api/v1/rovers/Curiosity/photos` +
      `?earth_date=2015-06-03` +
      `&api_key=${apiKey}`;
    const fecthApiData = async () => {
      try {
        await axios.get(url).then(response => {
          if (response.data) {
            setApiData(response.data.photos);
          } else {
            console.log('Error when retrive api data');
          }
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    fecthApiData();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: '0 0 auto', backgroundColor: '#f0f0f0' }}>
        <Header />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1 0 auto',
          backgroundColor: '#ffffff',
          padding: '20px',
          textAlign: 'center',
          paddingTop: 10,
          paddingBottom: 20,
          // paddingLeft: 30
        }}
      >
        <Box sx={{ paddingBottom: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Select the date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    maxDate={currentDate}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </Grid>
            <Grid item>
              <Select
                native
                defaultValue=""
                onChange={handleDropdownChange}
                sx={{ marginTop: 1 }}
              >
                <option value="">Select a rover</option>
                <option value="Curiosity">Curiosity</option>
                <option value="Opportunity">Opportunity</option>
                <option value="Spirit">Spirit</option>
              </Select>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#102C57',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#204C86',
                  },
                  mt: 3,
                  mb: 2,
                  borderRadius: 4,
                  fontSize: 'bold',
                  height: 35,
                }}
                onClick={fetchData}
              >
                Filter
              </Button>
            </Grid>
          </Grid>
        </Box>
        {errorMessage ? (
          <Typography variant="h4" color="error" sx={{ fontStyle: 'italic' }}>
            {errorMessage}
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {apiData.map((imageUrl, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={index}
                onClick={() => handleClickOpen(index)}
              >
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl.img_src}
                    alt={`Image ${index}`}
                  />
                  <CardContent>
                    <Typography variant="subtitle1">
                      {imageUrl.camera.full_name}
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(imageUrl.earth_date)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleDownload(imageUrl.img_src)}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Dialog open={open} onClose={handleClose} maxWidth="md">
          <DialogTitle>Information about the image</DialogTitle>
          <DialogContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {selectedImageIndex !== null && (
                <div>
                  <CardMedia
                    component="img"
                    src={apiData[selectedImageIndex].img_src}
                    alt={`Image ${selectedImageIndex}`}
                    sx={{ height: '330px', width: '800px' }}
                  />
                  <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Sol: {apiData[selectedImageIndex].sol}
                        </Typography>
                        <Typography variant="body1">
                          Camera Name:{' '}
                          <span
                            style={{
                              fontWeight: 'bold',
                              fontStyle: 'italic',
                            }}
                          >
                            {apiData[selectedImageIndex].camera.full_name}
                          </span>
                        </Typography>
                        <Typography variant="body1">
                          Earth Date:{' '}
                          {formatDate(apiData[selectedImageIndex].earth_date)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Rover Name:{' '}
                          <span
                            style={{
                              fontWeight: 'bold',
                              fontStyle: 'italic',
                            }}
                          >
                            {apiData[selectedImageIndex].rover.name}
                          </span>
                        </Typography>
                        <Typography variant="body1">
                          Landing Date:{' '}
                          {formatDate(
                            apiData[selectedImageIndex].rover.landing_date,
                          )}
                        </Typography>
                        <Typography variant="body1">
                          Launch Date:{' '}
                          {formatDate(
                            apiData[selectedImageIndex].rover.launch_date,
                          )}
                        </Typography>
                        <Typography variant="body1">
                          Total Photos:{' '}
                          {apiData[selectedImageIndex].rover.total_photos}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </div>
              )}
            </Box>
          </DialogContent>
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Dialog>
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
