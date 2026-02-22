import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Remote Collab API',
            version: '1.0.0',
            description: 'API documentation for Remote Collab application',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', example: 'john@example.com' },
                        isVerified: { type: 'boolean', example: false },
                    },
                },
                Workspace: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
                        name: { type: 'string', example: 'My Workspace' },
                        description: { type: 'string', example: 'This is a test workspace' },
                        owner: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        members: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    memberId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                                    role: { type: 'string', enum: ['admin', 'member'], example: 'admin' }
                                }
                            }
                        }
                    }
                },
                Channel: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cc' },
                        name: { type: 'string', example: 'general' },
                        workspaceId: { type: 'string', example: '60d0fe4f5311236168a109cb' },
                        members: { type: 'array', items: { type: 'string' } }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Error message description' }
                    }
                }
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
