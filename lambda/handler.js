const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    if (!event.requestContext.authorizer) {
      errorResponse('Authorization not configured', context.awsRequestId, callback);
      return;
    }

    console.log('Received event: ', event);

    // Because we're using a Cognito User Pools authorizer, all of the claims
    // included in the authentication token are provided in the request context.
    // This includes the username as well as other attributes.
    const username = event.requestContext.authorizer.claims['cognito:username'];

    const path = event.path;  // event.composedPath() / event.input.path might also apply
    const queryParameters = event.queryStringParameters;
    const httpMethod = event.httpMethod;

    console.log('Processing event: ', username, path, httpMethod, queryParameters);

    
    switch(path) {
        case '/familymembers':
            switch(httpMethod) {
                case 'GET':
                    getFamilyMembers(event, context, callback, username);
                    break;
                case 'POST':
                    addFamilyMember(event, context, callback, username);
                    break;
                default:
                    errorResponse('Method ' + httpMethod + ' not allowed for endpoint ' + path, context.awsRequestId, callback);
                    break;
            }
            break;
        case '/familymember':
            switch(httpMethod) {
                case 'GET':
                    let { member_uid } = queryParameters;
                    getFamilyMember(event, context, callback, username, member_uid);
                    break;
                case 'PUT':
                    // modifyFamilyMember(event, context, callback, username);
                    break;
                case 'DELETE':
                    // deleteFamilyMember(event, context, callback, username);
                    break;
                default:
                    errorResponse('Method ' + httpMethod + ' not allowed for endpoint ' + path, context.awsRequestId, callback);
                    break;
            }
            break;
        case '/familymember/status':
            switch(httpMethod) {
                case 'PUT':
                    modifyFamilyMemberStatus(event, context, callback, username);
                    break;
                default:
                    errorResponse('Method ' + httpMethod + ' not allowed for endpoint ' + path, context.awsRequestId, callback);
                    break;
            }
            break;
        default:
            errorResponse('Unknown endpoint ' + path, context.awsRequestId, callback);
            break;
    }
}

function getFamilyMembers(event, context, callback, username) {
    console.log('getFamilyMembers: ', username);
    readMembers(username).then((data) => {
        // You can use the callback function to provide a return value from your Node.js
        // Lambda functions. The first parameter is used for failed invocations. The
        // second parameter specifies the result data of the invocation.

        // Because this Lambda function is called by an API Gateway proxy integration
        // the result object must use the following structure.
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                parent_uid: username,
                members: data,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error("ERR01:")
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        errorResponse(err.message, context.awsRequestId, callback)
    });
}

function getFamilyMember(event, context, callback, username, member_uid) {
    console.log('getFamilyMember: ', username, member_uid);
    readMember(username, member_uid).then((data) => {
        // You can use the callback function to provide a return value from your Node.js
        // Lambda functions. The first parameter is used for failed invocations. The
        // second parameter specifies the result data of the invocation.

        // Because this Lambda function is called by an API Gateway proxy integration
        // the result object must use the following structure.
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                caller_uid: username,
                members: data,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error("ERR01:")
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        errorResponse(err.message, context.awsRequestId, callback)
    });
}

function addFamilyMember(event, context, callback, username) {
    console.log('addFamilyMember: ', username);

    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.
    const requestBody = JSON.parse(event.body);

    const membername = requestBody.member_uid;
    const status = 'pending'

    console.log('addFamilyMember: ', username, membername, status);

    recordMember(username, membername, status).then(() => {
        // You can use the callback function to provide a return value from your Node.js
        // Lambda functions. The first parameter is used for failed invocations. The
        // second parameter specifies the result data of the invocation.

        // Because this Lambda function is called by an API Gateway proxy integration
        // the result object must use the following structure.
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                parent_uid: username,
                member_uid: membername,
                status: status,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error("ERR02:")
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

function modifyFamilyMemberStatus(event, context, callback, username) {
    console.log('modifyFamilyMemberStatus: ', username);

    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.
    const requestBody = JSON.parse(event.body);

    const parentname = requestBody.parent_uid;
    const status = requestBody.status;

    console.log('modifyFamilyMemberStatus: ', username, parentname, status);

    if(status != "accepted" && status != "rejected" && status != "deleted") {
        errorResponse("Invalid status: " + status, context.awsRequestId, callback)
    }

    modifyMemberStatus(username, parentname, status).then(() => {
        // You can use the callback function to provide a return value from your Node.js
        // Lambda functions. The first parameter is used for failed invocations. The
        // second parameter specifies the result data of the invocation.

        // Because this Lambda function is called by an API Gateway proxy integration
        // the result object must use the following structure.
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                parent_uid: parentname,
                member_uid: username,
                status: status,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error("ERR03:")
        console.error(err);

        // If there is an error during processing, catch it and return
        // from the Lambda function successfully. Specify a 500 HTTP status
        // code and provide an error message in the body. This will provide a
        // more meaningful error response to the end client.
        errorResponse(err.message, context.awsRequestId, callback)
    });
};

function recordMember(username, membername, status) {
    const put = {
        TableName: 'gyl_family_member',
        Item: {
            parent_uid: username,
            member_uid: membername,
            status: status,
            request_time: new Date().toISOString(),
        },
    };
    console.log("DynamoDB Put: ", put)
    return ddb.put(put).promise();
}

function modifyMemberStatus(username, parentname, status) {
    var cmp1, cmp2
    if( status == 'accepted' ) {
        cmp1 = 'pending'
        cmp2 = 'deleting'
    } else if(status == 'rejected') {
        cmp1 = 'pending'
        cmp2 = 'pending'
    } else {
        cmp1 = 'deleting'
        cmp2 = 'deleting'
    }
    const update = {
        TableName: 'gyl_family_member',
        Key: {
            parent_uid: parentname,
            member_uid: username
        },
        UpdateExpression: "set #status = :s",
        ConditionExpression: "parent_uid = :p and (#status = :cmp1 or #status = :cmp2)",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues:{
            ":s": status,
            ":p": parentname,
            ":cmp1": 'pending',  // TODO: allow only for status='accepted' / 'rejected'
            ":cmp2": 'deleting'  // TODO: allow only for status='accepted' / 'deleted' 
        },
    };
    console.log("DynamoDB Update: ", update)
    return ddb.update(update).promise();
}

function readMembers(username) {
    const query = {
        TableName: 'gyl_family_member',
        IndexName: 'parent_uid-index',
        KeyConditionExpression: 'parent_uid = :hkey',
        ExpressionAttributeValues: {
        ':hkey': username,
        },
    };
    console.log("DynamoDB Query: ", query)
    return ddb.query(query).promise();
}

function readMember(username, membername) {
    var query = {}
    if (username == membername) {
        query = {
            TableName: 'gyl_family_member',
            KeyConditionExpression: 'member_uid = :hkey',
            ExpressionAttributeValues: {
                ':hkey': username,
            },
        }
    } else {
        query = {
            TableName: 'gyl_family_member',
            IndexName: 'parent_uid-index',
            KeyConditionExpression: 'parent_uid = :hkey',
            FilterExpression: 'member_uid = :mkey',
            ExpressionAttributeValues: {
                ':hkey': username,
                ':mkey': membername,
            },
        }
    }
    console.log("DynamoDB Query: ", query)
    return ddb.query(query).promise();
}

function errorResponse(errorMessage, awsRequestId, callback) {
  callback(null, {
    statusCode: 500,
    body: JSON.stringify({
      Error: errorMessage,
      Reference: awsRequestId,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
