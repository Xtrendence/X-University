# X:/University
A website to keep track of everything related to your life while studying a course in university. 

- There aren't too many validation checks on the server-side PHP code as this is **meant to be used privately rather than publicly**. 

- Shopping lists, reminders, settings etc. are stored in **JSON format** in ".config" files in "/source/cfg/", making it easy to move everything between computers without having to reconfigure everything every time.

- In terms of security, **.htaccess files are used to prevent anyone from directly accessing** the aforementioned ".config" files as well as files and notes you upload, so make sure your Apache server allows .htaccess files to override your configuration. The account password is stored using **BCrypt**, and in the future, I might allow the user to set up a PIN code for more confidential sections such as the "Finances" page.

# Default Login

**Username**: admin

**Password**: admin

![X:/University](https://www.xtrendence.com/www/images/xuniversity/xuniversity-light-large.png)
