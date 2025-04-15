# **Streaming App Admin Panel – Backend**

This project serves as the backend for a **Streaming Application's Admin Panel**. It provides RESTful APIs to manage content, genres, users, and background processing, tailored to the needs of a streaming platform.

---

## **Features**

- **Content Management**: Create, read, update, delete streaming content.
- **Genre Management**: Upload genre images and manage genre metadata.
- **User Management**: Handle admin/user-level data.
- **Queue System**: Background job management.
- **Clean Architecture**: Modular folder structure with controllers, models, services, and routes.

---

## **Project Structure**

```bash
.vscode/                 # Editor settings for VS Code
controllers/             # Request handlers (content, genre, user)
models/                  # MongoDB schemas
queue/                   # Job queue logic
routes/                  # All routing files
services/                # Business logic and service layer
uploads/genreImage/      # Uploaded genre images
util/                    # Helper utilities
index.js                 # App entry point
package.json             # NPM dependencies
.gitignore               # Ignored files for Git
```

---

#### **Installing Redis**

- **Windows**: Use [Memurai](https://www.memurai.com/) or [WSL](https://learn.microsoft.com/en-us/windows/wsl/) to run Redis in a Linux environment.
- **Ubuntu/Linux**:
  ```bash
  sudo apt update
  sudo apt install redis-server
  sudo systemctl enable redis
  sudo systemctl start redis
  ```
- **macOS (with Homebrew)**:
  ```bash
  brew install redis
  brew services start redis
  ```

Make sure Redis is running before starting the application because it will help us to run bull package.

## **Installation & Setup**

### **Prerequisites**

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Redis](https://redis.io/): Required for Bull queue system

### **Steps**

```bash
# Clone the repository
git clone https://github.com/shivam5676/streaming_app_admin_panel-_Backend.git
cd streaming_app_admin_panel-_Backend

# Install dependencies
npm install

# Create a .env file
PORT=8765
MONGODB_URI=use your own mongo connection url and many other secrets will be there

# Run the application
npm start
```

App will run at: `http://localhost:8765`

---

> **Note:** Authentication and authorization should be implemented for security (not included in base setup).

---

## **File Highlights**

- **controllers/**
  - `AddMovies.js`, `AllMovies.js`, `AllLanguages.js`
- **models/**
  - MongoDB schemas for `movies`, `genre`,`shorts` and `user`
- **services/**
  - Business logic split from controllers
- **queue/**
  - Queue implementation for async jobs like notification ,uploading content
- **routes/**
  - Route handlers for each module

---

## **Contributing**

Contributions, issues, and feature requests are welcome.

1. Fork the project
2. Create a new branch
3. Commit your changes
4. Open a pull request

---

## **License**

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more info.

---

## **Contact**

Maintained by [shivam5676](https://github.com/shivam5676)

---

> **Note:** Always add authentication, input validation, and error handling before deploying in production.
