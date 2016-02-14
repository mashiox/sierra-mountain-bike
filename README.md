# Sierra Mountain Bike Co.

## Preparing the Meteor environment for SMBC

You must have Meteor installed for your platform. 

https://www.meteor.com/

You must have git installed for your platform.

https://git-scm.com/

## Preparing the filesystem

With Meteor and Git installed move to the directory above where you'd like your copy of the SMBC project to live.

Then create the new project with meteor. 

On Windows:

```
cd C:\my_projects\
meteor create smbc
```

Likewise on UNIX/Linux/OS X

```
cd /home/masterfoo/my-projects/
meteor create smbc
```

Note you have one HTML, CSS, and JavaScript file present in your newly created meteor project. 
You may delete them all, as they will serve no purpose.

## Downloading the source SMBC from the git repository.

Being in the directory above your smbc directory, we'll clone the repo into a temporary directory (becuse we can't clone into an existent directory)
and then move all files from the git clone to our meteor project.

On Windows:

```
git clone https://bitbucket.org/... temp
move temp/* smbc/
cd smbc

```

On any UNIX variant: 
```
git clone https://bitbucket.org/... temp
mv temp/* smbc/
cd smbc
```

## Adding and Removing meteor packages

As the last step, we need to add the following packages (OSS/COTS) in order to stay in sync with the project.

You can add these with the command `meteor add <package name>`

```
accounts-base
accounts-password
iron:router
twbs:bootstrap
```

You can now run smbc with the command `meteor`