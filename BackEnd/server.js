const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

// Check the operating system
if(os.platform() !== 'win32') { // 'win32' is returned for both 32-bit and 64-bit versions of Windows
  console.error('Error: This application is only supported on Windows.');
  process.exit(1); // Exit the application with an error code
}

const audioControlExe = path.join(__dirname, '..', 'CSharp-Code', 'Release', 'net7.0', 'AudioControlApp.exe');


app.use(cors());

// Endpoint to increase volume
app.get('/increase-volume', (req, res) => {
  exec(`${audioControlExe} -incVol`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: 'Error increasing volume' });
    }
    const response = JSON.parse(stdout);
    res.json(response.volume);
    console.log(`Volume increased: ${response.volume}`);
  });
});

// Endpoint to decrease volume
app.get('/decrease-volume', (req, res) => {
  exec(`${audioControlExe} -decVol`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: 'Error decreasing volume' });
    }
    // stdout example: {"volume":"0"}
    const response = JSON.parse(stdout);
    res.json(response.volume);
    console.log(`Volume decreased: ${response.volume}`);
  });
});

// Endpoint to set the volume to a specific level
app.get('/set-volume/:level', (req, res) => {
  const level = parseInt(req.params.level, 10); // Extract the volume level from the URL path

  // Validate the level is within the 0-100 range
  if (isNaN(level) || level < 0 || level > 100) {
      return res.status(400).json({ error: 'Invalid volume level' });
  }

  exec(`${audioControlExe} -setVol ${level}`, (error, stdout, stderr) => {
      if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).json({ error: 'Error setting volume' });
      }
      const response = JSON.parse(stdout);
      res.json(response.volume);
      console.log(`Volume set to ${level}: ${response.volume}`);
  });
});

// Endpoint to toggle mute
app.get('/toggle-mute', (req, res) => {
  exec(`${audioControlExe} -toggleMute`, (error, stdout, stderr) => {
      if (error) {
          console.error(`exec error: ${error}`);
          return res.status(500).json({ error: 'Error toggling mute' });
      }
      const response = JSON.parse(stdout);
      console.log(`Mute toggled: ${response.mute}`);
      res.json(response.mute);
  });
});

app.get('/sleep', (req, res) => {
    exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error executing sleep command');
        }
        res.send('The computer is going to sleep');
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
