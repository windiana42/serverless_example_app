# Example Serverless App using 

This is just a serverless example app based on react-bootstrap, AWS Lambda, AWS DynamoDB, AWS Cognito that solves a few key problems to get started:

- Support desktop and mobile device
- Cognito integration for Login and Registering
- REST API to serverless backend
- DynamoDB put, query, update
- Internationalization

## Many thanks to...

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

The setup was inspired by: https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/

Cognito login setup from: https://github.com/patmood/react-aws-cognito-example and https://github.com/radeesh/AWSCognito-React-Bootstrap

## Preparation for hosting backend in AWS

Sorry for not having a precise Tutorial here how to setup the serverless backend. 
However, if you manage to get this app running you will be in much better shape to build your own app.

The following setup is very similar to this Tutorial: https://aws.amazon.com/getting-started/hands-on/build-serverless-web-app-lambda-apigateway-s3-dynamodb-cognito/

1. Create Cognito User Pool => goes in src/cognito-pool-data.json
1. Create Cognito Client Id => goes in src/cognito-pool-data.json
1. Create DynamoDB table gyl_family_members:
    - partition key: member_uid
    - sort key: parent_uid
    - futher attributes: status 
    - Setup DynamoDB Index called parent_uid-index (partition key: parent_uid)
1. Create IAM Rule for Lambda: AWSLambdaBasicExecutionRole + Inline: DynamoDB (putItem, updateItem, query)
1. Create Lambda function with lambda/handler.js (Give IAM Rule)
1. Setup Test request for both POST /familymembers and GET /familymembers
1. Create Gateway API: /{proxy+}/ANY (Use Cognito Authorizer with header 'Authorization') => url goes in src/rest-url.json

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
