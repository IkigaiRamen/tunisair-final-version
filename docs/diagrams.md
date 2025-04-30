# Application Diagrams

## General Use Case Diagram

```mermaid
graph TD
    subgraph Actors
        Admin[Administrator]
        Manager[Manager]
        User[Regular User]
        Guest[Guest User]
    end

    subgraph Authentication
        Login[Login to System]
        Register[Register Account]
        ResetPassword[Reset Password]
        ManageProfile[Manage Profile]
    end

    subgraph Meeting Management
        CreateMeeting[Create Meeting]
        EditMeeting[Edit Meeting]
        DeleteMeeting[Delete Meeting]
        ViewMeetings[View Meetings]
        JoinMeeting[Join Meeting]
        ManageParticipants[Manage Participants]
    end

    subgraph Document Management
        UploadDoc[Upload Document]
        DownloadDoc[Download Document]
        ViewDoc[View Document]
        EditDoc[Edit Document]
        DeleteDoc[Delete Document]
        ShareDoc[Share Document]
    end

    subgraph Task Management
        CreateTask[Create Task]
        AssignTask[Assign Task]
        UpdateTask[Update Task Status]
        ViewTasks[View Tasks]
        TrackProgress[Track Progress]
    end

    subgraph Decision Management
        MakeDecision[Make Decision]
        TrackDecision[Track Decision]
        ViewDecisions[View Decisions]
        UpdateDecision[Update Decision]
    end

    subgraph System Administration
        ManageUsers[Manage Users]
        ManageRoles[Manage Roles]
        SystemConfig[Configure System]
        GenerateReports[Generate Reports]
        ViewLogs[View System Logs]
    end

    %% Actor Connections
    Admin --> SystemConfig
    Admin --> ManageUsers
    Admin --> ManageRoles
    Admin --> GenerateReports
    Admin --> ViewLogs

    Manager --> CreateMeeting
    Manager --> EditMeeting
    Manager --> DeleteMeeting
    Manager --> MakeDecision
    Manager --> AssignTask
    Manager --> UploadDoc
    Manager --> ShareDoc

    User --> ViewMeetings
    User --> JoinMeeting
    User --> ViewDoc
    User --> DownloadDoc
    User --> ViewTasks
    User --> UpdateTask
    User --> ViewDecisions

    Guest --> Register
    Guest --> Login
    Guest --> ResetPassword

    %% Authentication Connections
    Admin --> Login
    Manager --> Login
    User --> Login
    Admin --> ManageProfile
    Manager --> ManageProfile
    User --> ManageProfile

    %% Meeting Management Connections
    Manager --> ManageParticipants
    User --> ViewMeetings
    User --> JoinMeeting

    %% Document Management Connections
    Manager --> UploadDoc
    Manager --> EditDoc
    Manager --> DeleteDoc
    User --> ViewDoc
    User --> DownloadDoc

    %% Task Management Connections
    Manager --> CreateTask
    Manager --> AssignTask
    User --> UpdateTask
    User --> ViewTasks
    User --> TrackProgress

    %% Decision Management Connections
    Manager --> MakeDecision
    Manager --> UpdateDecision
    User --> ViewDecisions
    User --> TrackDecision

    style Admin fill:#f9f,stroke:#333,stroke-width:2px
    style Manager fill:#bbf,stroke:#333,stroke-width:2px
    style User fill:#bfb,stroke:#333,stroke-width:2px
    style Guest fill:#fbb,stroke:#333,stroke-width:2px
```

## Use Case Diagram

```mermaid
graph TD
    User((User))
    Admin((Admin))
    Manager((Manager))
    
    User --> |Login| Auth[Authentication]
    User --> |View Profile| Profile[Profile Management]
    User --> |View Meetings| Meetings[Meeting Management]
    User --> |View Documents| Documents[Document Management]
    User --> |View Tasks| Tasks[Task Management]
    User --> |View Decisions| Decisions[Decision Management]
    
    Manager --> |Create Meeting| Meetings
    Manager --> |Assign Tasks| Tasks
    Manager --> |Make Decisions| Decisions
    Manager --> |Upload Documents| Documents
    
    Admin --> |Manage Users| UserManagement[User Management]
    Admin --> |Generate Reports| Reports[Reports & Analytics]
    Admin --> |Configure System| SystemConfig[System Configuration]
    
    subgraph Core Features
        Auth
        Profile
        Meetings
        Documents
        Tasks
        Decisions
    end
    
    subgraph Administrative Features
        UserManagement
        Reports
        SystemConfig
    end
```

## Class Diagram

```mermaid
classDiagram
    class User {
        +Long id
        +String username
        +String email
        +String firstName
        +String lastName
        +String department
        +String position
        +Role role
        +List~Meeting~ meetings
        +List~Task~ tasks
        +List~Decision~ decisions
        +getFullName() String
        +hasRole(String roleName) Boolean
        +canManageMeeting(Meeting meeting) Boolean
        +canViewDocument(Document document) Boolean
        +getUpcomingMeetings() List~Meeting~
        +getPendingTasks() List~Task~
    }
    
    class Role {
        +Long id
        +String name
        +List~User~ users
        +hasPermission(String permission) Boolean
        +addPermission(String permission) void
        +removePermission(String permission) void
    }
    
    class Meeting {
        +Long id
        +String title
        +String description
        +LocalDateTime startTime
        +LocalDateTime endTime
        +String location
        +MeetingStatus status
        +User organizer
        +List~User~ participants
        +List~Document~ documents
        +List~Decision~ decisions
        +isUpcoming() Boolean
        +isInProgress() Boolean
        +isCompleted() Boolean
        +addParticipant(User user) void
        +removeParticipant(User user) void
        +addDocument(Document document) void
        +addDecision(Decision decision) void
        +getDuration() Duration
    }
    
    class Document {
        +Long id
        +String title
        +String description
        +String filePath
        +String fileType
        +Long fileSize
        +Integer version
        +User uploadedBy
        +Meeting meeting
        +List~DocumentVersion~ versions
        +getLatestVersion() DocumentVersion
        +createNewVersion(File file) DocumentVersion
        +getDownloadUrl() String
        +getPreviewUrl() String
        +canBeEditedBy(User user) Boolean
    }
    
    class Task {
        +Long id
        +String title
        +String description
        +TaskStatus status
        +TaskPriority priority
        +LocalDateTime dueDate
        +User assignee
        +Decision decision
        +Meeting meeting
        +isOverdue() Boolean
        +updateStatus(TaskStatus newStatus) void
        +addComment(String comment) void
        +getComments() List~Comment~
        +getTimeRemaining() Duration
    }
    
    class Decision {
        +Long id
        +String title
        +String description
        +DecisionStatus status
        +LocalDateTime deadline
        +User responsibleUser
        +Meeting meeting
        +List~Task~ tasks
        +isOverdue() Boolean
        +addTask(Task task) void
        +updateStatus(DecisionStatus newStatus) void
        +getProgress() Double
        +getCompletedTasks() List~Task~
        +getPendingTasks() List~Task~
    }
    
    User "1" -- "1" Role : has
    User "1" -- "*" Meeting : participates in
    User "1" -- "*" Task : assigned to
    User "1" -- "*" Decision : responsible for
    User "1" -- "*" Document : uploads
    Meeting "1" -- "*" Document : contains
    Meeting "1" -- "*" Decision : results in
    Decision "1" -- "*" Task : generates
```

## Sequence Diagrams

### Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as AuthService
    participant B as Backend
    participant DB as Database
    
    U->>F: Enter credentials
    F->>A: login(credentials)
    A->>B: POST /api/auth/login
    B->>DB: Verify credentials
    DB-->>B: User data
    B-->>A: JWT token + user data
    A-->>F: Store token & user data
    F-->>U: Redirect to dashboard
```

### Meeting Creation Flow

```mermaid
sequenceDiagram
    participant M as Manager
    participant F as Frontend
    participant MS as MeetingService
    participant B as Backend
    participant DB as Database
    participant NS as NotificationService
    
    M->>F: Create new meeting
    F->>MS: createMeeting(meetingData)
    MS->>B: POST /api/meetings
    B->>DB: Save meeting
    DB-->>B: Saved meeting
    B->>NS: Notify participants
    NS->>DB: Save notifications
    B-->>MS: Meeting data
    MS-->>F: Update UI
    F-->>M: Show success message
```

### Document Upload Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant DS as DocumentService
    participant B as Backend
    participant S as Storage
    participant DB as Database
    
    U->>F: Select file to upload
    F->>DS: uploadDocument(file, metadata)
    DS->>B: POST /api/documents/upload
    B->>S: Store file
    S-->>B: File URL
    B->>DB: Save document metadata
    DB-->>B: Saved document
    B-->>DS: Document data
    DS-->>F: Update UI
    F-->>U: Show success message
```

### Task Assignment Flow

```mermaid
sequenceDiagram
    participant M as Manager
    participant F as Frontend
    participant TS as TaskService
    participant B as Backend
    participant DB as Database
    participant NS as NotificationService
    
    M->>F: Assign task
    F->>TS: assignTask(taskData)
    TS->>B: POST /api/tasks
    B->>DB: Save task
    DB-->>B: Saved task
    B->>NS: Notify assignee
    NS->>DB: Save notification
    B-->>TS: Task data
    TS-->>F: Update UI
    F-->>M: Show success message
```

### Decision Making Flow

```mermaid
sequenceDiagram
    participant M as Manager
    participant F as Frontend
    participant DS as DecisionService
    participant B as Backend
    participant DB as Database
    participant TS as TaskService
    
    M->>F: Make decision
    F->>DS: createDecision(decisionData)
    DS->>B: POST /api/decisions
    B->>DB: Save decision
    DB-->>B: Saved decision
    B->>TS: Create related tasks
    TS->>DB: Save tasks
    DB-->>B: Saved tasks
    B-->>DS: Decision data
    DS-->>F: Update UI
    F-->>M: Show success message
```

### Report Generation Flow

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant RS as ReportService
    participant B as Backend
    participant DB as Database
    
    A->>F: Request report
    F->>RS: generateReport(params)
    RS->>B: GET /api/reports
    B->>DB: Query data
    DB-->>B: Report data
    B->>B: Format report
    B-->>RS: Formatted report
    RS-->>F: Display report
    F-->>A: Show report
``` 