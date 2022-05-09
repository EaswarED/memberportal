# Mindworx Patient Portal - API

## Setup Instructions
Get the latest code from Github and follow these steps

* Open Terminal Window

* Run below command to install NPM packages
```bash
  $ npm install
```
* We will be setting up a new Python Virtual Environment using Anaconda. However, standard venv can also be used. Visit  [Anaconda](https://www.anaconda.com/products/individual) and complete the install

* Run below commands to create the environment and install python packages
```bash
  $ conda create -n <ENV_NAME> python=3.8 pip
  $ conda activate <ENV_NAME>
  $ pip install requests
  $ pip install PyYAML
  $ pip install Cerberus
  $ pip install boto3
```
* Install AWS CLI if it's not installed already. Download [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-mac.html)

* Run below command and create a new AWS profile. Example mindworx-dev
```bash
  $ aws configure
```
* Copy env-{stage}.yml file from docs/ folder to the project root folder.

## Framework - To-Dos
Some of the pending Framwork Changes - Owner: Kali

### Pending
* Lamda Warm-up [URL](https://www.serverless.com/blog/keep-your-lambdas-warm)
* Data Encryption at Rest [URL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/EncryptionAtRest.html)
* Implemented 3rd Party Layers (Numpy, Pandas from Klayers). Repackage them and make them part of Mindworx [URL](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html)

### Completed
* Introduces Pandas, Numpy layers (08/22)
* Moved env-dev.yml to "docs" folder (08/22)
* Implemented expanded list of Response Codes: 200, 201, 400, 401, 403, 499, 500 (08/21)
