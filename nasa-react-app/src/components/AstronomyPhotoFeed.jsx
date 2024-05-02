import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { Footer } from './Footer';
import Header from './Header';
import axios from 'axios';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import DownloadIcon from '@mui/icons-material/Download';

const ExpandMore = styled(props => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const CustomCardContainer = styled(Box)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
}));

export default function AstronomyPhotoFeed() {
  const [expanded, setExpanded] = React.useState(false);
  const [apiData, setApiData] = React.useState({
    date: '',
    explanation: '',
    hdurl: '',
    title: '',
    url: '',
  });
  const [selectedDate, setSelectedDate] = React.useState(null);
  const currentDate = dayjs();

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
      link.setAttribute('download', 'Apodimage.jpg');
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const formatDate = dateString => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const handleDateChange = newDate => {
    setSelectedDate(newDate);
    fetchData(newDate);
  };

  const fetchData = async date => {
    if (!date) return;
    const apiKey = import.meta.env.VITE_NASA_API_KEY;
    const url =
      'https://api.nasa.gov/planetary/apod' +
      `?date=${date.format('YYYY-MM-DD')}` +
      `&api_key=${apiKey}`;
    await axios
      .get(url)
      .then(response => {
        if (response.data) {
          setApiData({
            date: formatDate(response.data.date),
            explanation: response.data.explanation,
            hdurl: response.data.hdurl,
            title: response.data.title,
            url: response.data.url,
          });
        } else {
          console.log('Error when retrieve API data');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  React.useEffect(() => {
    const apiKey = import.meta.env.VITE_NASA_API_KEY;
    const url = 'https://api.nasa.gov/planetary/apod' + `?api_key=${apiKey}`;
    const fetchApiData = async () => {
      try {
        await axios.get(url).then(res => {
          if (res.data) {
            setApiData({
              date: formatDate(res.data.date),
              explanation: res.data.explanation,
              hdurl: res.data.hdurl,
              title: res.data.title,
              url: res.data.url,
            });
          } else console.log('Error when retrieve API data');
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchApiData();
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
        }}
      >
        <Box sx={{ paddingBottom: 4 }}>
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
        </Box>
        <CustomCardContainer>
          <Card>
            <CardHeader
              title={
                <Typography sx={{ fontWeight: 'bold', fontSize: 24 }}>
                  {apiData.title}
                </Typography>
              }
              subheader={
                <Typography sx={{ fontWeight: 300, fontStyle: 'italic' }}>
                  {apiData.date}
                </Typography>
              }
            />
            <CardMedia
              component="img"
              height="auto"
              image={apiData.hdurl}
              alt="NASA Astronomy Picture of the Day"
            />
            <CardActions disableSpacing>
              <IconButton onClick={() => handleDownload(apiData.url)}>
                <DownloadIcon />
              </IconButton>
              <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'justify', fontSize: 16, fontWeight: 400 }}
                >
                  {apiData.explanation}
                </Typography>
              </CardContent>
            </Collapse>
          </Card>
        </CustomCardContainer>
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
