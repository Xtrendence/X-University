# X:/University
A website to keep track of everything related to your life while studying a course in university. 

- The JavaScript portion of the code is a bit messy just because I had to remove some features and move stuff around for a public release. You might see remnants of these in the CSS code. I might add comments to the JS code later on and organize it a bit, but it works fine. Also, keep in mind there aren't too many validation checks on the server-side PHP code as this is meant to be used privately rather than publicly. 

- Shopping lists, reminders, settings etc. are stored in JSON format in ".config" files in "/source/cfg/", making it easy to move everything between computers without having to reconfigure everything every time.

- In terms of security, .htaccess files are used to prevent anyone from directly accessing the aforementioned ".config" files as well as files and notes you upload, so make sure your Apache server allows .htaccess files to override your configuration. The account password is stored using BCrypt, and in the future, the ".config" files might be entirely encrypted using AES-256 and the user's password, so even if someone manages to access your server, they can't actually go through your private information without having your password. 

# Default Login

Username: admin

Password: admin
