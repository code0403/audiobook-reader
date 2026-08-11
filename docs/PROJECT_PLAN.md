
# Audiobook Reader — Project Plan

## Phase 1 — Project Foundation & Architecture

### 1. Project Objective

Build a personal web application that allows a user to read a book (PDF/EPUB) while simultaneously listening to its corresponding audiobook.

The application should synchronize audiobook playback with the corresponding book text so that the currently spoken portion of the book can be visually highlighted while the audio is playing.

The primary goal is to create a local-first synchronized reading experience:

> Listen to the audiobook → identify the corresponding text → highlight it in the book → automatically keep the reader synchronized with the audio.

---

## 2. Application Type

### Decision: Browser-Based Web Application

The first version will be developed as a **browser-based application**, rather than a native desktop application.

The application will be accessible through a normal web browser such as:

* Chrome
* Firefox
* Edge

### Two intended modes

#### Mode A — Local

The application will run locally on the user's computer.

Example:

```text
User's Laptop
│
├── Backend
│    └── localhost
│
├── Frontend
│    └── localhost
│
├── Audiobook
│
└── EPUB/PDF
        │
        ▼
     Browser
```

The user can select personal audiobook and book files from the local filesystem.

The files do not need to be uploaded to a server simply to use the application locally.

#### Mode B — Deployed

The application should eventually be deployable to the internet.

Initial deployment candidates:

* Render
* AWS

The deployed version will initially be treated as a technical/demo deployment rather than a large-scale production service.

Cloud storage and handling of large audiobook/book files will be considered separately.

---

## 3. Version 1 (V1) Scope

The first version will focus only on the core reading and synchronization experience.

### V1 will support

* Loading an audiobook file from the local computer
* Loading the corresponding book
* EPUB as the primary book format
* PDF support as a secondary format
* Playing, pausing, and seeking through the audiobook
* Displaying the book text
* Highlighting the currently synchronized text
* Automatically moving the reader as the audiobook progresses
* Manually seeking through the audio
* Displaying current reading/playback progress
* Remembering the current position during a session
* Local processing of the user's files

### V1 will NOT focus on

* User accounts
* Social features
* Online book libraries
* Multiple-user support
* Mobile applications
* DRM removal
* Automatic downloading of books/audiobooks
* AI-generated narration
* Text-to-speech
* Recommendation systems

These may be considered in future versions.

---

## 4. Primary User Workflow

The intended V1 workflow is:

1. User opens the application.
2. User selects an audiobook file.
3. User selects the corresponding EPUB/PDF book.
4. Application processes the book.
5. Application extracts readable text.
6. Application processes the audiobook.
7. Application determines how the audiobook corresponds to the book text.
8. Application creates a synchronization map between audio timestamps and text.
9. User starts playback.
10. Application highlights the currently spoken text.
11. Reader automatically follows the highlighted text.
12. User can pause, resume, or seek through the audiobook.
13. The corresponding book position updates automatically.

Conceptually:

```text
                 ┌─────────────────┐
                 │   Audiobook     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Synchronization │
                 │     Engine      │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   Book Reader   │
                 └────────┬────────┘
                          │
                          ▼
                   Highlighted Text
```

---

## 5. Core Functional Requirements

### 5.1 Audio Player

The application must provide:

* Play
* Pause
* Seek forward
* Seek backward
* Progress indicator
* Current playback time
* Total duration
* Playback speed
* Volume control

### 5.2 Book Reader

The application must:

* Display book content
* Support normal reading/navigation
* Highlight synchronized text
* Automatically scroll to the currently spoken section
* Allow manual navigation

### 5.3 Synchronization

The synchronization engine is the core feature of the application.

It must eventually support a mapping similar to:

```text
Audio timestamp
       ↓
Text segment
       ↓
Book location
```

Example:

```text
00:12:41 → "The sun had already disappeared..."
00:12:45 → "and the streets were becoming quiet."
00:12:49 → "John continued walking..."
```

The exact synchronization technique will be determined during implementation.

---

## 6. EPUB and PDF Strategy

### EPUB — Primary Format

EPUB will be the first book format implemented.

Reason:

* EPUB is fundamentally a structured digital-book format.
* Text can generally be extracted more reliably.
* Chapters and document structure can be preserved.
* Individual text elements can be identified.
* It is better suited to text-level synchronization.

### PDF — Secondary Format

PDF support will be implemented after the EPUB workflow works.

PDF introduces additional challenges:

* Complex layouts
* Multiple columns
* Headers and footers
* Images
* Scanned pages
* Text positioning
* Reading order

Therefore, PDF synchronization will be treated as a separate processing problem rather than assuming PDF and EPUB can use exactly the same pipeline.

---

## 7. Synchronization Architecture

The most difficult part of the project is determining exactly which text is being spoken at a particular audio timestamp.

A normal audiobook may contain audio without information such as:

```text
00:10:21 → Chapter 2 → Paragraph 14
```

Therefore, the application may need to generate synchronization information.

Initial conceptual pipeline:

```text
                BOOK
                  │
                  ▼
           Extract Text
                  │
                  ▼
          Normalize Text
                  │
                  ▼
            Text Segments
                  │
                  │
                  ▼
AUDIO ──────► Audio Processing
                  │
                  ▼
           Speech Recognition
                  │
                  ▼
         Text/Audio Alignment
                  │
                  ▼
        Synchronization Map
                  │
                  ▼
        Timestamp → Text Range
```

The synchronization system will be implemented as an independent component so that different alignment approaches can be tested without rewriting the frontend.

---

## 8. Initial Technology Stack

### Frontend

* React
* TypeScript
* Vite
* HTML5 Audio API
* EPUB rendering library
* PDF rendering library

The frontend will be responsible for:

* User interface
* Audio playback
* Book rendering
* Highlighting
* Scrolling
* Playback controls
* User interaction

### Backend

* Python
* FastAPI

The backend will be responsible for processing tasks such as:

* EPUB parsing
* PDF text extraction
* Audio processing
* Text normalization
* Speech recognition
* Alignment
* Synchronization-map generation

### Supporting Services

Docker will be used when additional services become necessary.

The database will be selected later based on actual requirements.

---

## 9. Local-First File Strategy

The local version should allow the user to select:

```text
Audiobook
    +
EPUB/PDF
```

directly from the local computer.

For example:

```text
My Book/
├── audiobook.mp3
└── book.epub
```

The application should avoid uploading personal book/audio files unnecessarily.

The browser can read user-selected files using browser file APIs.

However, some processing tasks may require the files to be passed to the local backend.

Therefore the local architecture may eventually be:

```text
Browser
   │
   ├── Book File
   │
   └── Audio File
          │
          ▼
     Local Backend
          │
          ▼
   Processing Engine
          │
          ▼
 Synchronization Map
          │
          ▼
       Browser
```

---

## 10. Deployment Strategy

The application should be designed so that the same codebase can operate in two environments.

### Local

```text
Browser
   │
   ▼
localhost frontend
   │
   ▼
localhost backend
```

### Cloud

```text
Browser
   │
   ▼
Public Frontend
   │
   ▼
Cloud Backend
   │
   ▼
Processing Services
```

Initial deployment candidates:

* Render
* AWS

The exact deployment architecture will be selected after the local MVP works.

### Important Cloud Consideration

Audiobook files can be large.

Therefore, the deployed application should not initially assume that users will upload entire audiobooks to the application server.

Possible future approaches include:

* Browser-local playback
* Object storage
* Direct browser-to-storage uploads
* Temporary processing
* User-controlled storage
* Streaming from object storage

These decisions will be made after the local MVP is functional.

---

## 11. Initial Project Structure

```text
audiobook-reader/
│
├── frontend/
│
├── backend/
│
├── data/
│
├── docs/
│
├── .gitignore
│
└── README.md
```

The structure may evolve as the application grows.

---

## 12. Development Milestones

### Phase 1 — Foundation & Architecture

* [X] Development environment
* [X] WSL2
* [X] Ubuntu
* [X] Node.js
* [X] Python
* [X] Docker
* [X] VS Code + WSL
* [X] Git repository
* [X] Main branch
* [X] Initial project structure
* [X] Application type selected
* [X] Initial architecture documented

### Phase 2 — Frontend Skeleton

Create the React/Vite application.

Goal:

```text
Browser
   ↓
Audiobook Reader UI
```

### Phase 3 — Basic Audio Player

Implement:

```text
Play
Pause
Seek
Progress
Speed
Volume
```

### Phase 4 — EPUB Reader

Load an EPUB and display its content.

Goal:

```text
EPUB
 ↓
Reader
 ↓
Readable text
```

### Phase 5 — Text Processing

Extract and normalize book text.

Goal:

```text
Book
 ↓
Clean text
 ↓
Segments
```

### Phase 6 — Audio Processing

Process the audiobook and obtain speech/transcription information.

Goal:

```text
Audio
 ↓
Speech
 ↓
Timestamped text
```

### Phase 7 — Synchronization Engine

Align:

```text
Audiobook transcript
        +
Book text
        ↓
Synchronization Map
```

### Phase 8 — Synchronized Reader

Combine the systems:

```text
Audio playback
      ↓
Timestamp
      ↓
Synchronization map
      ↓
Text highlight
      ↓
Automatic scrolling
```

### Phase 9 — Persistence

Add:

* Reading position
* Audio position
* Book state
* Synchronization data

### Phase 10 — PDF Support

Add PDF processing and rendering.

### Phase 11 — Dockerization

Containerize the backend and supporting services.

### Phase 12 — Deployment

Deploy a working version to:

* Render, or
* AWS

depending on cost and technical requirements.

---

## 13. Definition of the First MVP

The first meaningful MVP is:

> **The user selects an EPUB and an audiobook, starts playback, and sees the corresponding text highlighted and automatically followed while listening.**

The MVP does not need:

* Authentication
* Cloud storage
* Multiple users
* Mobile applications
* Advanced UI
* Recommendation systems

The synchronization experience is the primary success criterion.

---

## 14. Development Philosophy

The project will be developed incrementally.

Priorities:

1. Working functionality
2. Simple architecture
3. Clear separation between UI and processing
4. Local-first operation
5. Testable synchronization logic
6. Extensibility

Complex infrastructure should not be introduced until it solves an actual problem.

The project will be developed as a learning project as well as a functional application, so technical decisions should be understood and documented rather than blindly copied.
