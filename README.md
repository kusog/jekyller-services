# Jekyller Services
[Serverless](https://serverless.com/) nodesjs services setup for [AWS Lambdas](https://aws.amazon.com/lambda/) that aims to be an optional set of 
CMS type services designed to store core content within a github repo.

These CMS services are designed to work specifically with [Jekyll site structures](https://jekyllrb.com/), 
such as creating new blog posts within Jekyll's _post directory.  Currently all editing is for html markup 
in content and posts, but future direction includes creating Jekyll collections of any type.

# Why Use Jekyller
The main issue with CMS like WordPress, Joomla, and other is that in order to use your site you have to get the
full CMS up and running.  Hosting those services requires databases and processing time for each call to generate
the contents of a client request.  Jekyll sites have the flexibility of a templating system without having the need for
a server to run afterwards.

This service works well with github pages based sites, which support Jekyll directly along with 
continuous deployment from the sites github repository.  

By using Jekyller, you can add inline editing and content creation to the power of the Jekyller source.
You can still use whatever other content editors you may be using to edit and maintain your Jekyll based
site, but also use these to add more interactive administrative services to the site.  

Hosted sites in github pages are free, which gives you a versioned continuous deployment based 
website which can optionally have its own domain name you purchase.  The first 1 million calls
to Amazon Lambda based services are free, and after that cost very little.  **For most sites, that
means the total cost to host your site and services is the cost of the domain name.**  

Anther major benefit from this type of system is that the content of the site automatically gets versioning for
all the pages and posts in the site.  Future work of this project could include showing the commit history of
the specific page/post in order to allow the user to roll back changes or see who made the changes and when. 

## Installation
You will need an [AWS account](https://aws.amazon.com/) to deploy the node.js services, which will 
deploy as [AWS Lambdas](https://aws.amazon.com/lambda/).

You will need a http://github.com account to host the content of the site.  Registration is free
for publicly hosted sites, but you can pay for private repositories.  This project currently uses
basic authentication with github userid/password setup in its configuration.  Github offers
more elaborate authentication options and this project could be setup to use those at some point.

1. If necessary, [install serverless](https://serverless.com/framework/docs/getting-started/) on your development environment and configure it for your AWS account.  Follow the serverless quick start directions for it to have access to your
AWS account in order to deploy these services.  *Do not move on to the next step until you have a properly setup AWS account and a working serverless environment for it.
2. Clone or download this repository
3. Rename _example.env.yml_ to _env.yml_ and set [environment variables]. This is the file where you configure the site's github account access information.
4. Run `npm install` to ensure the nodejs library for github is properly installed
5. Run `serverless deploy` 

## Using Jekyller in a Jekyll website
A basic Jekyller starter site that uses bootstrap 4, jQuery 3, and uses Jekyller services for dynamically
editing content and creating posts.  The repo can be found at https://github.com/kusog/jekyller-webclient

The webclient project will need the api endpoints for each of the lambdas created in this project.  Once
you've completed the first `serverless deploy` you will see the endpoints listed in its output.  Part of the 
deploy output is a section for `Service Information` that will provide an `endpoint:` section with the needed
urls.

### My Starting Web Process
When I am using Jekyller for a new site, I typically do the following, which keeps things organized.

1. Create a new email account.  I typically use the free gmail.com for this.  This will be used for 
other services and can be used as an admin type account for the site.
2. Create a new github.com account, registering with the new email account setup.
3. Create a new directory for the site in development environment.  I typically name it the domain name of the site.
4. Download the Jekyller-Services repo and unzip it into a child directory called services.
5. Download the Jekyller-Webclient repo and unzip it into a child directory named after the domain name of the site.
6. Create the website repo in the new github.com account which will be the primary repo for this account.
7. Clone the repo into a child directory of the main project.  Use similar syntax to _git clone https://username:password@github.com/username/repository.git_ in order to associate the local repo with the github.com repo using the new github account.
7. Setup the git [user.name](https://help.github.com/articles/setting-your-username-in-git/) and [user.email](https://help.github.com/articles/setting-your-commit-email-address-in-git/) within the new website child directory using the git documentation that outlines this.
9. Edit the website project _config.yml properties of the Jekyller based site.  It is important to setup the url option to the new domain name.
10. Use the config options of the repo in github.com to setup the github pages account.
