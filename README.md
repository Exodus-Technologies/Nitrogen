# Nitrogen

Microservice for all interactions for bambuser integration which includes: uploading to S3 directly, updating metadata, and manage datat in S3 bucket and MongoDB (Video Manager)

# Requirements

For development, you will only need Node.js and a node global package (NPM) installed in your
environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer. Also, be
  sure to have `git` available in your PATH, `npm` might need it (You can find git
  [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the
  [official Node.js website](https://nodejs.org/) and the
  [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v14.5.0

    $ npm --version
    6.14.6

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following
command, just open again the command line and be happy.

    $ npm install npm -g

###

---

# Install

    $ git clone https://github.com/Exodus-Technologies/Nitrogen.git
    $ cd Nitrogen
    $ npm install

# Configure app

Nitrogen utilizes dotenv[https://github.com/motdotla/dotenv] for environment variable configuration.

- NODE_ENV (node environment)
- PORT (application port)
- HOST (hostname for application)
- DEFAULT_CACHE_TTL (ttl for node cache module for requests)
- CLUSTER_DOMAIN (mongo db clsuter name)
- DB_NAME (databse name)
- DB_USER (databse user name)
- DB_PASS (databse user password)
- AWS_ACCESS_KEY_ID (AWS access key)
- AWS_SECRET_ACCESS_KEY (AWS secret access key)
- AWS_REGION (AWS region)
- S3_VIDEO_BUCKET_NAME (bucket name for videos)
- S3_THUMBNAIL_BUCKET_NAME (bucket for thumbnails)
- BAMBUSER_APP_KEY_IOS (bambuser appkey for ios devices)
- BAMBUSER_APP_KEY_ANDROID (bambuser appkey for android devices)
- BAMBUSER_APP_KEY_WEB (bambuser appkey for desktop apps)
- BAMBUSER_API_KEY (bambuser api key)
- BAMBUSER_DAID (bambuser daid)
- BAMBUSER_DASECRET (bambuser dasecret)

# Running the project (development mode)

Nitrogen utilizes nodemon [https://www.npmjs.com/package/nodemon] auto-restart of server after
changes and edits.

    $ npm run serve:dev

See `package.json` for description of task.

# Start application (production mode)

    $ npm start

# Deployment (Docker and Amazon Container Service or ECS)

Nitrogen utilizes various services provides by AWS:

- Route 53 (DNS)
- EC2 (Load balancer, Target Groups, Security groups)
- ECR (Docker container registry)
- ECS (Container Services that handles autoscaling and destination of "tasks")

See [host](http://livestream.exodustechnologies.com/video-service/probeCheck) for more details and a test drive...
