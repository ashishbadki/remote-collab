# RemoteCollab Application Flow Documentation

## Overview

RemoteCollab is a real-time collaboration platform built with a full-stack architecture. The backend is implemented in Node.js with Express.js and TypeScript, using MongoDB for data persistence and WebSockets for real-time communication. The frontend is built with React, TypeScript, and Vite, featuring a modern UI with Tailwind CSS.

## Architecture

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time Communication**: WebSockets (ws library)
- **API Documentation**: Swagger/OpenAPI
- **Security**: Password hashing (bcrypt), message encryption (AES-256-CBC)

### Frontend Architecture
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Real-time**: WebSocket API

## Frontend Execution Flow

```
Browser loads index.html
    ↓
main.tsx bootstraps React application
    ↓
App.tsx initializes providers (AuthContext, SocketContext)
    ↓
React Router decides which page to render
    ↓
Page components load
    ↓
Components trigger API calls or WebSocket actions
```

### Detailed Frontend Startup Flow

1. **index.html** - Entry point served by Vite dev server
2. **main.tsx** - React root creation and App component mounting
3. **App.tsx** - Router setup with AuthProvider and SocketProvider wrappers
4. **AuthContext** - Loads user profile and token on app initialization
5. **SocketContext** - Establishes WebSocket connection when authenticated
6. **React Router** - Renders appropriate page based on URL and auth state
7. **Pages** - Login, Signup, Dashboard, Workspace components render
8. **Components** - Trigger API calls via Axios or WebSocket messages

### Example Flow: User Login Journey

```
index.html → main.tsx → App.tsx → AuthProvider → SocketProvider → React Router → Login Page → Form Submission → API Call → AuthContext Update → Dashboard Redirect
```

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── app.ts                 # Express app setup, middleware, routes
│   ├── server.ts              # HTTP server creation, WebSocket initialization
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   └── swagger.ts         # API documentation setup
│   ├── controllers/
│   │   ├── authController.ts  # Authentication logic
│   │   ├── userController.ts  # User profile management
│   │   ├── workspaceController.ts # Workspace CRUD
│   │   ├── channel.controller.ts  # Channel management
│   │   ├── messageController.ts   # Message operations
│   │   └── inviteController.ts    # Invite handling
│   ├── models/
│   │   ├── userModel.ts           # User schema
│   │   ├── createWorkspaceModel.ts # Workspace schema
│   │   ├── channel.model.ts       # Channel schema
│   │   ├── message.model.ts       # Message schema
│   │   └── invite.model.ts        # Invite schema
│   ├── routes/
│   │   ├── authRoutes.ts          # Auth endpoints
│   │   ├── userRoutes.ts          # User endpoints
│   │   ├── workspaceRoutes.ts     # Workspace endpoints
│   │   ├── channelRoutes.ts       # Channel endpoints
│   │   ├── message.route.ts       # Message endpoints
│   │   └── inviteRoutes.ts        # Invite endpoints
│   ├── middlewares/
│   │   ├── authMiddleware.ts      # JWT authentication
│   │   └── wsAuth.ts              # WebSocket authentication
│   ├── sockets/
│   │   └── chat.socket.ts         # WebSocket chat logic
│   ├── types/
│   │   ├── authRequest.ts         # Request type extensions
│   │   ├── iUserType.ts           # User interface
│   │   └── iUserMethodType.ts     # User methods
│   ├── utils/
│   │   ├── encryption.ts          # Message encryption/decryption
│   │   └── generateInviteToken.ts # Token generation
│   └── scripts/
│       └── exportSwagger.ts       # Swagger export script
├── package.json
├── tsconfig.json
└── swagger.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── main.tsx                 # React app entry point
│   ├── App.tsx                  # Main app component with routing
│   ├── index.css                # Global styles
│   ├── components/
│   │   ├── Logo.tsx             # Logo component
│   │   ├── Navbar.tsx           # Navigation bar
│   │   ├── Sidebar.tsx          # Workspace sidebar
│   │   ├── ChatArea.tsx         # Chat interface
│   │   ├── CreateWorkspace.tsx  # Workspace creation modal
│   │   ├── allWorkspaceList.tsx # Workspace list
│   │   ├── InviteLinkBody.tsx   # Invite link component
│   │   ├── Footer.tsx           # Footer component
│   │   └── protectedRoute.tsx   # Route protection
│   ├── pages/
│   │   ├── Landing.tsx          # Landing page
│   │   ├── Login.tsx            # Login page
│   │   ├── Signup.tsx           # Signup page
│   │   ├── Dashboard.tsx        # Dashboard page
│   │   └── Workspace.tsx        # Workspace page
│   ├── context/
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── SocketContext.tsx    # WebSocket state
│   ├── api/
│   │   ├── auth.api.ts          # Auth API calls
│   │   ├── user.api.ts          # User API calls
│   │   ├── workspace.api.ts     # Workspace API calls
│   │   ├── channel.api.ts       # Channel API calls
│   │   ├── message.api.ts       # Message API calls
│   │   └── invite.api.ts        # Invite API calls
│   ├── constants/
│   │   └── endpoints.ts         # API endpoints
│   ├── types/
│   │   └── workspace.ts         # TypeScript types
│   └── utils/
│       └── storage.ts           # Local storage utilities
├── public/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.js
```

## System Architecture Diagram

```
┌─────────────────┐    HTTP/WebSocket    ┌─────────────────┐
│   User Browser  │◄────────────────────►│  Express Server │
│                 │                      │   (Port 3000)   │
│  ┌────────────┐ │                      │                 │
│  │ React App  │ │    REST API Calls    │  ┌────────────┐ │
│  │ (Vite)     │◄──────────────────────►│  │ Controllers │ │
│  └────────────┘ │                      │  └────────────┘ │
│                 │                      │                 │
│  WebSocket     │◄────────────────────►│  WebSocket      │
│  Real-time     │    Messages           │  Server (ws)    │
└─────────────────┘                      └─────────────────┘
                                                 │
                                                 ▼
                                        ┌─────────────────┐
                                        │   MongoDB       │
                                        │   Database      │
                                        └─────────────────┘

Data Flow:
1. User interacts with React UI
2. Axios makes HTTP requests to Express API
3. Controllers process requests and interact with MongoDB
4. WebSocket handles real-time messaging
5. Responses sent back to frontend
```

## Application Flow

### 1. User Registration and Authentication

#### Signup Process
1. User visits the landing page (`/`)
2. Clicks "Sign Up Free" → navigates to `/signup`
3. Fills signup form with name, email, password, confirmPassword
4. Frontend validates input format (email regex, password strength)
5. POST request to `/api/v1/auth/signup`
6. Backend:
   - Validates input (email format, password strength, matching passwords)
   - Checks if user already exists
   - Hashes password with bcrypt
   - Creates user in MongoDB
   - Generates JWT token (expires in 30 days)
   - Returns token and user data
7. Frontend stores token in localStorage
8. AuthContext updates state, redirects to `/dashboard`

#### Login Process
1. User visits `/login`
2. Enters email and password
3. Frontend validates email format
4. POST request to `/api/v1/auth/login`
5. Backend:
   - Validates email format
   - Finds user by email
   - Compares password with bcrypt
   - Generates JWT token
   - Returns token and user data
6. Frontend stores token, updates context, redirects to dashboard

##### Example Login Request
```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "ashish@gmail.com",
  "password": "Password123!"
}
```

##### Example Login Response
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWY0YzJmMWFiYzMzZjQ1NjciLCJpYXQiOjE3MTA0MzI1MDAsImV4cCI6MTcxMzAyNDUwMH0.example_signature",
  "user": {
    "_id": "65f4c2f1abc33f4567",
    "name": "Ashish Badki",
    "email": "ashish@gmail.com"
  },
  "message": "User logged in successfully"
}
```

#### Authentication Middleware
- All protected routes use `authMiddleware`
- Extracts Bearer token from Authorization header
- Verifies JWT signature and expiration
- Attaches `userId` to request object
- Rejects requests with invalid/missing tokens

### 2. Dashboard and Workspace Management

#### Dashboard Loading
1. User accesses `/dashboard` (protected route)
2. AuthContext loads user profile from `/api/v1/user/profile`
3. Fetches workspaces from `/api/v1/workspace/my`
4. Backend returns workspaces where user is owner or member
5. Displays workspace list with stats (total members, channels)

#### Creating a Workspace
1. User clicks "Create Workspace" in dashboard
2. Modal opens with form (name, type: personal/team/startup/enterprise)
3. POST to `/api/v1/workspace/create`
4. Backend:
   - Validates user authentication
   - Creates workspace with owner = req.userId
   - Returns workspace data
5. Frontend refreshes workspace list

#### Joining a Workspace via Invite
1. User clicks "Join Workspace" in dashboard
2. Enters invite token
3. POST to `/api/v1/invite/accept/{token}`
4. Backend:
   - Validates token and authentication
   - Checks invite hasn't expired or been used
   - Adds user to workspace members with specified role
   - Marks invite as used
5. Frontend refreshes workspace list

#### Workspace Invitations
1. Workspace owner/admin clicks "Invite Members"
2. POST to `/api/v1/invite/create/{workspaceId}`
3. Backend:
   - Validates user is owner/admin
   - Generates secure random invite token using Node.js crypto module
   - Creates invite record (expires in 24 hours)
   - Returns invite link: `http://localhost:3000/api/v1/invite/accept/{token}`
4. Owner shares link with potential members

### 3. Channel Management

#### Viewing Channels
1. User clicks on workspace → navigates to `/workspace/{workspaceId}`
2. Frontend fetches workspace details and channels
3. GET `/api/v1/channel/workspace/{workspaceId}`
4. Backend:
   - Validates user is member of workspace
   - Returns all channels for the workspace
5. Sidebar displays channel list

#### Creating Channels
1. User (owner/admin) clicks "Add Channel" in sidebar
2. Enters channel name
3. POST `/api/v1/channel/create/{workspaceId}`
4. Backend:
   - Validates user permissions (owner or admin)
   - Creates channel with createdBy = req.userId
   - Returns channel data
5. Frontend adds channel to sidebar, selects it

#### Deleting Channels
1. User (owner/admin) clicks delete on channel
2. DELETE `/api/v1/channel/delete/{channelId}`
3. Backend:
   - Validates permissions
   - Deletes channel from database
4. Frontend removes from sidebar

### 4. Real-time Messaging

#### WebSocket Connection
1. User enters workspace page
2. SocketContext establishes WebSocket connection
3. URL: `ws://localhost:3000?token={jwt}`
4. Backend verifies token via `verifySocketToken`
5. Attaches `userId` to socket, adds to workspace room

#### WebSocket Event Flow

##### Connection Establishment
```
Client connects to ws://localhost:3000?token={jwt}
    ↓
Server verifies JWT token
    ↓
Token valid: Attach userId to socket
    ↓
Add socket to workspace room
    ↓
Connection established - ready for messaging
```

##### Message Send Event
```
User types message → Click Send
    ↓
Frontend: sendMessage(workspaceId, channelId, message)
    ↓
WebSocket sends: {workspaceId, channelId, message}
    ↓
Server: Encrypt message with AES-256-CBC
    ↓
Server: Store encrypted message in MongoDB
    ↓
Server: Broadcast plaintext to all workspace clients
    ↓
Clients receive: {sender, channelId, message}
```

##### Message Receive Event
```
Server broadcasts message to workspace room
    ↓
Client WebSocket receives JSON payload
    ↓
SocketContext adds message to state
    ↓
ChatArea re-renders with new message
    ↓
UI updates with sender name and timestamp
```

#### Sending Messages
1. User types message in ChatArea
2. Clicks send or presses Enter
3. Frontend calls `sendMessage(workspaceId, channelId, message)`
4. WebSocket sends JSON payload: `{workspaceId, channelId, message}`
5. Backend:
   - Encrypts message with AES-256-CBC
   - Saves to MongoDB: Message {workspaceId, channelId, sender, encryptedText}
   - Broadcasts plaintext message to all clients in workspace room

#### Receiving Messages
1. WebSocket receives message from server
2. JSON: `{sender: userId, channelId, message: plaintext}`
3. Frontend adds to messages state
4. ChatArea renders new message with sender name

#### Loading Message History
1. User selects channel
2. GET `/api/v1/messages/{channelId}`
3. Backend:
   - Fetches messages for channel
   - Decrypts each message
   - Populates sender name
   - Returns decrypted messages
4. Frontend displays message history

#### Deleting Messages
1. User clicks delete on their message (or admin on any)
2. Confirms deletion
3. DELETE `/api/v1/messages/{messageId}`
4. Backend:
   - Validates permissions (sender or admin/owner)
   - Deletes from database
5. Frontend removes from UI

### Error Handling Flow

The application implements comprehensive error handling across all layers:

#### Authentication Errors (401 Unauthorized)
```
Invalid or missing JWT token
```
**Example Response:**
```json
{
  "message": "No token"
}
```

```
Expired JWT token
```
**Example Response:**
```json
{
  "message": "Invalid token"
}
```

#### Validation Errors (400 Bad Request)
```
Invalid email format
```
**Example Response:**
```json
{
  "success": false,
  "message": "Please enter a valid email address"
}
```

```
Weak password
```
**Example Response:**
```json
{
  "success": false,
  "message": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
}
```

```
User already exists during signup
```
**Example Response:**
```json
{
  "success": false,
  "message": "User already exists"
}
```

#### Authorization Errors (403 Forbidden)
```
User attempting to delete workspace they don't own
```
**Example Response:**
```json
{
  "success": false,
  "message": "Only owner can delete this workspace"
}
```

```
Non-admin trying to create channel
```
**Example Response:**
```json
{
  "success": false,
  "message": "Forbidden: You do not have permission to create channels"
}
```

#### Not Found Errors (404 Not Found)
```
Accessing non-existent workspace
```
**Example Response:**
```json
{
  "success": false,
  "message": "Workspace not found"
}
```

```
Invalid invite token
```
**Example Response:**
```json
{
  "success": false,
  "message": "Invite not found"
}
```

#### Server Errors (500 Internal Server Error)
```
Database connection failure
```
**Example Response:**
```json
{
  "success": false,
  "message": "Internal server error"
}
```

```
Message decryption failure
```
**Example Response:**
```json
{
  "success": false,
  "message": "Error: Could not decrypt message"
}
```

### 5. Data Models

#### User Model
```typescript
{
  name: string,
  email: string (unique),
  isVerified: boolean (default: false),
  password: string (hashed)
}
```

#### Workspace Model
```typescript
{
  name: string,
  type: "personal" | "team" | "startup" | "enterprise",
  owner: ObjectId (ref: User),
  members: [{
    userId: ObjectId (ref: User),
    role: "admin" | "member"
  }]
}
```

#### Channel Model
```typescript
{
  name: string,
  workspace: ObjectId (ref: Workspace),
  createdBy: ObjectId (ref: User),
  isPrivate: boolean (default: false),
  allowedRoles: ["admin", "member", "owner"],
  members: [ObjectId] (ref: User)
}
```

#### Message Model
```typescript
{
  workspaceId: ObjectId (ref: Workspace),
  channelId: ObjectId (ref: Channel),
  sender: ObjectId (ref: User),
  encryptedText: string
}
```

#### Invite Model
```typescript
{
  token: string (unique),
  workspaceId: ObjectId (ref: Workspace),
  role: "admin" | "member",
  expiresAt: Date,
  used: boolean,
  createdBy: ObjectId (ref: User)
}
```

### 6. Security Features

#### Password Security
- Minimum 8 characters, uppercase, lowercase, number, special character
- Hashed with bcrypt (salt rounds: 10)

#### Message Encryption
- Messages stored encrypted in database
- AES-256-CBC encryption with secret key from environment
- Fixed IV (not recommended for production - should use random IV)

**Security Recommendation:** In production environments, each message should use a randomly generated IV stored alongside the encrypted text to prevent cryptographic vulnerabilities and ensure perfect forward secrecy.

#### Authentication
- JWT tokens with 30-day expiration
- Automatic logout on token expiry
- Protected routes with middleware

#### Authorization
- Workspace: Only owner can delete, invite others
- Channel: Owner/admin can create/delete channels
- Messages: Sender or workspace admin/owner can delete

### 7. API Endpoints

#### Authentication
- POST `/api/v1/auth/signup` - User registration
- POST `/api/v1/auth/login` - User login

#### User
- GET `/api/v1/user/profile` - Get user profile

#### Workspace
- POST `/api/v1/workspace/create` - Create workspace
- GET `/api/v1/workspace/my` - Get user's workspaces
- GET `/api/v1/workspace/{id}` - Get workspace by ID
- DELETE `/api/v1/workspace/{id}` - Delete workspace

#### Invite
- POST `/api/v1/invite/create/{workspaceId}` - Create invite
- POST `/api/v1/invite/accept/{token}` - Accept invite

#### Channel
- GET `/api/v1/channel/workspace/{workspaceId}` - Get channels
- POST `/api/v1/channel/create/{workspaceId}` - Create channel
- DELETE `/api/v1/channel/delete/{channelId}` - Delete channel

#### Messages
- GET `/api/v1/messages/{channelId}` - Get messages
- DELETE `/api/v1/messages/{messageId}` - Delete message

### 8. Frontend State Management

#### AuthContext
- Manages authentication state (token, user, loading)
- Handles login, signup, logout
- Persists token in localStorage
- Loads user profile on app start

#### SocketContext
- Manages WebSocket connection
- Handles real-time messages
- Provides sendMessage function
- Reconnects on token change

### 9. Development and Deployment

#### Backend Development
- `npm run dev` - Starts with ts-node-dev (auto-restart)
- `npm run build` - Compiles TypeScript
- `npm run start` - Runs compiled JavaScript
- `npm run swagger:export` - Exports Swagger JSON

#### Frontend Development
- `npm run dev` - Starts Vite dev server
- `npm run build` - Builds for production
- `npm run lint` - Runs ESLint

#### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CHAT_SECRET_KEY` - Message encryption key
- `PORT` - Server port (default: 3000)

### 10. Key Features

1. **Real-time Collaboration**: WebSocket-based instant messaging
2. **Workspace Management**: Create, join, and manage workspaces
3. **Channel Organization**: Organize conversations by channels
4. **User Authentication**: Secure JWT-based auth
5. **Message Encryption**: End-to-end encryption for messages
6. **Role-based Access**: Admin/owner permissions
7. **Responsive UI**: Modern, mobile-friendly interface
8. **API Documentation**: Comprehensive Swagger docs

### 11. Future Improvements

The following enhancements could be implemented to further improve the platform:

#### Security Enhancements
- **End-to-end encryption** for messages using asymmetric cryptography
- **Two-factor authentication (2FA)** for user accounts
- **Rate limiting** on API endpoints to prevent abuse
- **Audit logging** for sensitive operations
- **Session management** with device tracking

#### Real-time Features
- **Typing indicators** in chat to show when users are typing
- **Message reactions** (like, thumbs up, etc.)
- **Message threading** for organized conversations
- **Presence indicators** showing online/offline status
- **Push notifications** for mobile apps

#### Collaboration Features
- **File sharing** with cloud storage integration
- **Screen sharing** and video calls
- **Task management** within workspaces
- **Calendar integration** for meeting scheduling
- **Document collaboration** with real-time editing

#### Advanced Permissions
- **Granular permissions** for channels (read-only, write, admin)
- **Custom roles** beyond admin/member
- **Temporary access** with time-limited permissions
- **Approval workflows** for sensitive actions

#### Analytics and Monitoring
- **Workspace analytics** (message volume, active users)
- **Performance monitoring** and error tracking
- **User engagement metrics**
- **Usage reports** for workspace owners

#### User Experience
- **Dark mode** theme toggle
- **Keyboard shortcuts** for power users
- **Message search** across channels
- **Message bookmarks** and favorites
- **Custom workspace themes** and branding

#### Scalability
- **Message pagination** for large channels
- **Database sharding** for high-traffic deployments
- **CDN integration** for static assets
- **Caching layer** (Redis) for improved performance

This documentation covers the complete flow of the RemoteCollab application from user registration through real-time messaging and workspace management.</content>
<parameter name="filePath">c:\Users\ashis\OneDrive\Desktop\Mega-Project\remote-collab\APPLICATION_FLOW.md