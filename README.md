# Custom AWS Layer for SAM Applications

This repository contains code and instructions for creating a custom AWS Lambda layer that can be reused in other AWS Serverless Application Model (SAM) applications.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

In AWS Lambda, a layer is a distribution mechanism for libraries, custom runtimes, or other function dependencies. By creating a custom AWS layer, you can package and share common code across multiple SAM applications, reducing duplication and improving maintainability.

This repository provides a starting point for creating your own custom AWS layer. It includes a sample structure and configuration files to help you get started quickly.

## Getting Started

To get started with this repository, follow these steps:

1. Clone the repository to your local machine using `git clone https://github.com/faraz-35/sam-aws-layer.git`.
2. Install the necessary dependencies using `npm i`
3. create a '.env' file and add ENV = LOCAL (for local testing)
4. run the dynamodb-local-setup and dynamodb-table-creation scripts (for local testing)

## Usage

To use the custom AWS layer in your SAM applications, follow these steps:

1. Build & Deploy to AWS using `npm run deploy`

For detailed instructions on how to use AWS Lambda layers with SAM applications, refer to the official AWS documentation.

## Contributing

Contributions to this repository are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This repository is licensed under the [MIT License](LICENSE).
