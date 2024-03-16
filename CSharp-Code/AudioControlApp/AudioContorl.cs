using System;
using NAudio.CoreAudioApi;

namespace AudioControlApp
{
    public class AudioControl
    {
        private MMDeviceEnumerator deviceEnumerator;
        private int volumeStep = 5; // Default volume step size

        public AudioControl()
        {
            deviceEnumerator = new MMDeviceEnumerator();
        }

        public int VolumeStep
        {
            get { return volumeStep; }
            set { volumeStep = value; }
        }

        public int SetVolume(int level)
        {
            try
            {
                MMDevice defaultDevice = deviceEnumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);
                defaultDevice.AudioEndpointVolume.MasterVolumeLevelScalar = level / 100f;
                
                //Console.WriteLine($"Volume set to {level}%");
                return level;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error setting volume: {ex.Message}");
                return -1; // return -1 if error
            }
        }

        public int ChangeVolume(bool increase)
        {
            try
            {
                MMDevice defaultDevice = deviceEnumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);
                float currentVolume = defaultDevice.AudioEndpointVolume.MasterVolumeLevelScalar;
                float newVolume = increase ? currentVolume + (volumeStep / 100f) : currentVolume - (volumeStep / 100f);
                newVolume = Math.Max(0, Math.Min(1, newVolume));
                int newVolumePercentage = (int)(newVolume * 100);

                // Set the new volume using the SetVolume method
                SetVolume(newVolumePercentage);

                //Console.WriteLine($"Volume changed to {newVolumePercentage}%");
                return newVolumePercentage;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error changing volume: {ex.Message}");
                return -1; // return -1 if error
            }
        }


        public int GetVolume()
        {
            try
            {
                MMDevice defaultDevice = deviceEnumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);
                return (int)(defaultDevice.AudioEndpointVolume.MasterVolumeLevelScalar * 100);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting volume: {ex.Message}");
                return -1; // return -1 if error
            }
        }

        public bool ToggleMute()
        {
            try
            {
                MMDevice defaultDevice = deviceEnumerator.GetDefaultAudioEndpoint(DataFlow.Render, Role.Multimedia);
                defaultDevice.AudioEndpointVolume.Mute = !defaultDevice.AudioEndpointVolume.Mute;
                return defaultDevice.AudioEndpointVolume.Mute;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error toggling mute: {ex.Message}");
                return false;
            }
        }
    }
}
