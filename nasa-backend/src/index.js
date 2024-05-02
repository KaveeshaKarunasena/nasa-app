import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import { connectToDatabase } from './services/dbConnector.service.js';
import { accountRoute } from './routes/account.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const currentFileUrl = import.meta.url;
const currentFilePath = fileURLToPath(currentFileUrl);
const currentDir = dirname(currentFilePath);
const imagesDir = join(currentDir, '/images');

app.get('/download-image', async (req, res) => {
  try {
    const imageUrl = req.query.imageUrl;
    console.log(imageUrl);
    axios({
      method: 'get',
      url: imageUrl,
      responseType: 'stream',
      maxRedirects: 5,
    })
      .then(response => {
        if (response.status === 200) {
          const filename = `image_${Date.now()}.jpg`;
          const filePath = join(imagesDir, filename);

          const fileStream = fs.createWriteStream(filePath);
          response.data.pipe(fileStream);

          fileStream.on('finish', () => {
            console.log(`Image saved successfully: ${filePath}`);
            res.sendFile(filePath);
          });

          fileStream.on('error', err => {
            console.error('Error saving image:', err);
            res.status(500).json({ error: 'Internal Server Error' });
          });
        } else {
          console.error(`Request failed with status code: ${response.status}`);
          res.status(400).json({ error: 'Failed to download' });
        }
      })
      .catch(error => {
        console.error('Error downloading image:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  } catch (error) {
    console.error('Error downloading image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use('/api/v1/users', accountRoute);
//call the database connection and start the app
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(
        `[server]: Server is running at http://localhost:${port}/api`,
      );
    });
  })
  .catch(err => console.log(err));
