using System;

class Program {
    static void Main(string[] args) {
        if (args.Length > 0 && args[0] == "devices") {
            Console.WriteLine("List of devices attached");
        }
    }
}
