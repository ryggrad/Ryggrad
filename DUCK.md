## TODO;

- [ ] swappable storage engines

For swappable storage engines we just have something that implements 
create, read, update, delete

Then inside each method at the end we pass off to the current storage engine. Which is set on the instance 
of the model and defaults to Ajax

Local storage is only 