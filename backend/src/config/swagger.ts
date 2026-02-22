import swaggerJsdoc from 'swagger-jsdoc';
import { Options } from 'swagger-jsdoc';

const options: Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Remote Collab API',
            version: '1.0.0',
            description: '### API documentation for Remote Collab application\n[http://localhost:3000/swagger.json](http://localhost:3000/swagger.json)',
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
                Message: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cd' },
                        workspaceId: { type: 'string', example: '60d0fe4f5311236168a109cb' },
                        channelId: { type: 'string', example: '60d0fe4f5311236168a109cc' },
                        sender: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        encryptedText: { type: 'string', example: 'U2FsdGVkX1+...' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                Invite: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109ce' },
                        token: { type: 'string', example: 'v1-invite-token-abc' },
                        workspaceId: { type: 'string', example: '60d0fe4f5311236168a109cb' },
                        role: { type: 'string', enum: ['admin', 'member'], example: 'member' },
                        expiresAt: { type: 'string', format: 'date-time' },
                        used: { type: 'boolean', example: false },
                        createdBy: { type: 'string', example: '60d0fe4f5311236168a109ca' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string', example: 'Detailed error message' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    field: { type: 'string', example: 'email' },
                                    message: { type: 'string', example: 'Invalid email format' }
                                }
                            }
                        }
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
