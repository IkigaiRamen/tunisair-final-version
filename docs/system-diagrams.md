# Tunisair Meeting Management System - Architecture Diagrams

## Class Diagram
```mermaid
classDiagram
    class User {
        +Long id
        +String fullName
        +String email
        +String password
        +List<Role> roles
        +boolean enabled
        +register()
        +login()
        +updateProfile()
    }

    class Role {
        +Long id
        +RoleName name
    }

    class Meeting {
        +Long id
        +String title
        +String agenda
        +String objectives
        +DateTime dateTime
        +User createdBy
        +List<User> participants
        +List<Document> documents
        +List<Decision> decisions
        +DateTime createdAt
        +DateTime updatedAt
        +create()
        +update()
        +delete()
        +addParticipant()
    }

    class Document {
        +Long id
        +String name
        +String type
        +String path
        +Integer version
        +Meeting meeting
        +User uploadedBy
        +DateTime createdAt
        +DateTime updatedAt
        +String description
        +Long size
        +upload()
        +download()
        +updateVersion()
    }

    class Decision {
        +Long id
        +String content
        +Meeting meeting
        +User responsibleUser
        +DateTime deadline
        +List<Task> tasks
        +create()
        +update()
        +assignTasks()
    }

    class Task {
        +Long id
        +String description
        +TaskStatus status
        +Decision decision
        +User assignedTo
        +DateTime deadline
        +create()
        +updateStatus()
        +assignUser()
    }

    class NotificationLog {
        +Long id
        +User user
        +String message
        +NotificationType type
        +DateTime sentAt
        +boolean read
        +send()
        +markAsRead()
    }

    User "1" -- "*" Role : has
    Meeting "1" -- "*" User : has participants
    Meeting "1" -- "1" User : created by
    Meeting "1" -- "*" Document : contains
    Meeting "1" -- "*" Decision : has
    Decision "1" -- "*" Task : generates
    Task "1" -- "1" User : assigned to
    Document "1" -- "1" User : uploaded by
    NotificationLog "1" -- "1" User : sent to
```

## Sequence Diagram - Meeting Creation
```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant AuthGuard
    participant MeetingController
    participant MeetingService
    participant Repository
    participant Database

    User->>Frontend: Create New Meeting
    Frontend->>AuthGuard: Check Authorization
    AuthGuard->>Frontend: Authorized
    Frontend->>MeetingController: POST /api/meetings
    MeetingController->>MeetingService: createMeeting(meetingDTO)
    MeetingService->>Repository: save(meeting)
    Repository->>Database: INSERT
    Database-->>Repository: Success
    Repository-->>MeetingService: Meeting Entity
    MeetingService-->>MeetingController: MeetingDTO
    MeetingController-->>Frontend: 201 Created
    Frontend-->>User: Show Success Message
```

## Sequence Diagram - Document Upload with Versioning
```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant DocumentController
    participant DocumentService
    participant StorageService
    participant Repository
    participant FileSystem

    User->>Frontend: Upload Document
    Frontend->>DocumentController: POST /api/documents
    DocumentController->>DocumentService: uploadDocument(file, metadata)
    DocumentService->>StorageService: storeFile(file)
    StorageService->>FileSystem: Save File
    FileSystem-->>StorageService: File Path
    StorageService-->>DocumentService: Storage Location
    DocumentService->>Repository: save(documentEntity)
    Repository-->>DocumentService: Saved Document
    DocumentService-->>DocumentController: DocumentDTO
    DocumentController-->>Frontend: 201 Created
    Frontend-->>User: Show Success Message
```

## Use Case Diagram
```mermaid
graph TB
    subgraph Actors
        Admin((Admin))
        User((User))
        Secretary((Secretary))
        System((System))
    end

    subgraph Meeting Management
        M1[Create Meeting]
        M2[Edit Meeting]
        M3[Delete Meeting]
        M4[View Meetings]
        M5[Manage Participants]
    end

    subgraph Document Management
        D1[Upload Document]
        D2[Download Document]
        D3[Version Control]
        D4[Delete Document]
    end

    subgraph Task Management
        T1[Create Task]
        T2[Assign Task]
        T3[Update Status]
        T4[Track Progress]
    end

    subgraph Notifications
        N1[Send Notifications]
        N2[Read Notifications]
        N3[Configure Alerts]
    end

    %% Admin connections
    Admin -->|Can do all| M1
    Admin -->|Can do all| M2
    Admin -->|Can do all| M3
    Admin -->|Can do all| D1
    Admin -->|Can do all| D2
    Admin -->|Can do all| D3
    Admin -->|Can do all| D4
    Admin -->|Can do all| T1
    Admin -->|Can do all| T2
    Admin -->|Can do all| T3
    Admin -->|Can do all| N3

    %% User connections
    User --> M4
    User --> D2
    User --> T3
    User --> N2

    %% Secretary connections
    Secretary --> M1
    Secretary --> M2
    Secretary --> D1
    Secretary --> D2
    Secretary --> T1
    Secretary --> T2

    %% System connections
    System --> N1
```

## Component Diagram
```mermaid
graph TB
    subgraph Frontend
        UI[User Interface]
        Auth[Auth Module]
        Meet[Meeting Module]
        Doc[Document Module]
        Task[Task Module]
        Not[Notification Module]
    end

    subgraph Backend
        API[REST API]
        Security[Security Layer]
        Service[Service Layer]
        Repo[Repository Layer]
        Storage[File Storage]
    end

    subgraph Database
        SQL[(MySQL Database)]
        Files[(File System)]
    end

    UI --> Auth
    UI --> Meet
    UI --> Doc
    UI --> Task
    UI --> Not

    Auth --> API
    Meet --> API
    Doc --> API
    Task --> API
    Not --> API

    API --> Security
    Security --> Service
    Service --> Repo
    Service --> Storage

    Repo --> SQL
    Storage --> Files
```

## State Diagram - Meeting Lifecycle
```mermaid
stateDiagram-v2
    [*] --> Draft: Create Meeting
    Draft --> Scheduled: Set Date & Time
    Scheduled --> InProgress: Start Meeting
    InProgress --> Completed: End Meeting
    InProgress --> Cancelled: Cancel Meeting
    Completed --> [*]
    Cancelled --> [*]

    state Draft {
        [*] --> Setting_Agenda
        Setting_Agenda --> Adding_Participants
        Adding_Participants --> Review
        Review --> [*]
    }

    state InProgress {
        [*] --> Taking_Minutes
        Taking_Minutes --> Making_Decisions
        Making_Decisions --> Creating_Tasks
        Creating_Tasks --> [*]
    }
``` 