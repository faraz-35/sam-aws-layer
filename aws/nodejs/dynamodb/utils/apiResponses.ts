import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

type APIResponse = {
    data?: any;
    error?: string;
    message?: string;
};


export const missingFieldsResponse = (missingFields: string[]): APIGatewayProxyStructuredResultV2 => {
    return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
        body: JSON.stringify({
            error: 'Missing required fields',
            data: missingFields,
        } as APIResponse),
    };
};

export const invalidFieldResponse = (field: string): APIGatewayProxyStructuredResultV2 => {
    return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
        body: JSON.stringify({
            error: 'Invalid ' + field,
        } as APIResponse),
    };
};

export const successResponse = (message?: string, data?: unknown): APIGatewayProxyStructuredResultV2 => {
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
        body: JSON.stringify({
            message: message,
            data: data,
        } as APIResponse),
    };
};

export const errorResponse = (error: any): APIGatewayProxyStructuredResultV2 => {
    console.info({ error });
    return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
        body: JSON.stringify({
            error: error.message,
        } as APIResponse),
    };
};

export const INVALID_ENDPOINT: APIGatewayProxyStructuredResultV2 = {
    statusCode: 404,
    headers: { 'Content-Type': 'application/json' },
    isBase64Encoded: false,
    body: JSON.stringify({
        error: 'Invalid endpoint',
    } as APIResponse),
};
