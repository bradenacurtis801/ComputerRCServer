
namespace AudioControlApp
{
    class Program
    {
        static void Main(string[] args)
        {
            AudioControl audioControl = new AudioControl();

            if (args.Length > 0)
            {
                switch (args[0])
                {
                    case "-h":
                    case "-help":
                        GetHelp();
                        break;
                    case "-setVol":
                        if (args.Length >= 2 && int.TryParse(args[1], out int setLevel))
                        {
                            Console.WriteLine($"{{ \"volume\": \"{audioControl.SetVolume(setLevel)}\" }}");
                        }
                        else
                        {
                            Console.WriteLine("{\"error\": \"Invalid volume level specified.\"}");
                        }
                        break;

                    case "-incVol":
                        Console.WriteLine($"{{ \"volume\": \"{audioControl.ChangeVolume(increase: true)}\" }}");
                        break;

                    case "-decVol":
                        Console.WriteLine($"{{ \"volume\": \"{audioControl.ChangeVolume(increase: false)}\" }}");
                        break;

                    case "-getVol":
                        Console.WriteLine($"{{ \"volume\": \"{audioControl.GetVolume()}\" }}");
                        break;

                    case "-toggleMute":
                        Console.WriteLine($"{{ \"mute\": \"{audioControl.ToggleMute()}\" }}");
                        break;

                    default:
                        Console.WriteLine("{\"error\": \"Unknown command.\"}");
                        GetHelp();
                        break;
                }
            }
            else
            {
                Console.WriteLine("No arguments specified.");
                GetHelp();
            }
        }

        static string GetHelp()
        {
            string usage = @"
            Usage:
                -setVol [level]    Set volume to [level].
                -incVol            Increase volume.
                -decVol            Decrease volume.
                -getVol            Get current volume level.
                -toggleMute        Toggle Mute.
                -help              Show this help message.
            ";
            Console.WriteLine(usage);
            return usage;
        }
    }
}