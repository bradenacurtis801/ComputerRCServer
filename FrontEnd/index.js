const volumeSlider = document.getElementById("volume-slider");
const volumeDisplay = document.getElementById("volume-display");
let debounceTimeout;
let serverIp = "10.10.1.20"; // Replace with your server IP address (Dont use localhost if you want to access this api through a different device on the local network i.e. your phone. It needs to point to the servers IP address)

volumeSlider.addEventListener("input", () => {
    clearTimeout(debounceTimeout); // Clear the previous debounce timeout
    const volumeLevel = volumeSlider.value;
    updateVolumeDisplay(volumeLevel);
    
    // Define the function to execute after debounce time
    const debounceFunction = () => {
      fetch(`http://${serverIp}:3000/set-volume/${volumeLevel}`)
        .then((response) => {
          if (response.ok) {
            console.log(`Volume set to ${volumeLevel}`);
          } else {
            console.error("Failed to set volume");
          }
        })
        .catch((error) => {
          console.error(error.message);
        });
    };
  
    // Set the debounce timeout
    debounceTimeout = setTimeout(debounceFunction, 300); // Adjust the debounce time as needed
  });

function updateVolumeDisplay(volumeLevel) {
    const numericValue = volumeLevel.replace(/\D/g, '');
    const intValue = parseInt(numericValue);
    volumeDisplay.textContent = `Volume: ${volumeLevel}%`;
    volumeSlider.value = intValue;
  }

document.getElementById("volume-up").addEventListener("click", () => {
    fetch(`http://${serverIp}:3000/increase-volume`)
      .then((response) => {
        if (response.ok) {
          return response.text(); // Parse response as text
        } else {
          throw new Error("Failed to increase volume");
        }
      })
      .then((volumeLevel) => {
        console.log(`Volume increased to ${volumeLevel}%`);
        updateVolumeDisplay(volumeLevel);
      })
      .catch((error) => {
        console.error(error.message);
      });
  });
  
  document.getElementById("volume-down").addEventListener("click", () => {
    fetch(`http://${serverIp}:3000/decrease-volume`)
      .then((response) => {
        if (response.ok) {
          return response.text(); // Parse response as text
        } else {
          throw new Error("Failed to decrease volume");
        }
      })
      .then((volumeLevel) => {
        console.log(`Volume decreased to ${volumeLevel}%`);
        updateVolumeDisplay(volumeLevel);
      })
      .catch((error) => {
        console.error(error.message);
      });
  });
  

// Update the volume setting function to include a specific level
document.getElementById("set-volume").addEventListener("click", function () {
    const level = prompt("Enter volume level (0-100):");
    if (level !== null && level !== "") {
      fetch(`http://${serverIp}:3000/set-volume/${level}`)
        .then((response) => {
          if (response.ok) {
            return response.text(); // Parse response as text
          } else {
            throw new Error("Failed to set volume");
          }
        })
        .then((volumeLevel) => {
          console.log(`Volume set to ${volumeLevel}%`);
          updateVolumeDisplay(volumeLevel);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  });
  

document.getElementById("sleep").addEventListener("click", function () {
  fetch(`http://${serverIp}:3000/sleep`)
    .then((response) => {
      if (response.ok) {
        console.log("Computer is going to sleep");
      } else {
        console.error("Failed to execute sleep command");
      }
    })
    .catch((error) => console.error("Error:", error));
});

function findLocalIP(onIP) {
  // Create a peer connection
  const pc = new RTCPeerConnection({iceServers: []});
  pc.onicecandidate = event => {
    if (event.candidate) {
      const ipMatch = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(event.candidate.candidate);
      if (ipMatch) {
        onIP(ipMatch[0]);
        pc.close();
      }
    }
  };
  pc.createDataChannel(""); //create a bogus data channel
  pc.createOffer().then(offer => pc.setLocalDescription(offer)).catch(err => console.error(err));
  // Timeout for browsers that are not going to return an IP
  setTimeout(() => {
    onIP(null); // Callback with null after timeout
    pc.close();
  }, 1500); // Adjust timeout as needed
}

// Usage
findLocalIP(ip => {
  if (ip) {
    console.log('Local IP:', ip);
  } else {
    console.log('Local IP not found');
  }
});