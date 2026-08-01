# 🛡️ TrackerShield

![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-green)
![Version](https://img.shields.io/badge/Version-1.2.0-blue)
![License](https://img.shields.io/badge/License-MIT-success)

A privacy-focused Chrome Extension built using **Chrome Manifest V3** that blocks known tracking scripts, protects users from online trackers, and provides a modern analytics dashboard with real-time statistics.

---

# 📖 Overview

TrackerShield is a lightweight privacy-focused browser extension that enhances user security by blocking known tracking requests before they reach the browser.

It provides a clean user interface for monitoring tracker activity, viewing analytics, managing trusted and blocked domains, and exporting local statistics—all while keeping user data private.

---

# ✨ Features

### 🛡️ Privacy Protection

- Block known tracking domains
- Real-time tracker blocking
- Lightweight background service
- Manifest V3 architecture
- Privacy-first design

### 📊 Analytics Dashboard

- Total blocked trackers
- Today's blocked trackers
- Protected websites counter
- Top blocked tracker domains
- Activity log
- Statistics export

### ⚙️ Settings

- Enable / Disable protection
- Whitelist management
- Blacklist management
- Export backup
- Export statistics
- Reset statistics

### 📈 Statistics

- Badge counter
- Daily statistics
- Protected sites counter
- Local Chrome Storage
- Activity tracking

---

# 📸 Screenshots

## 🛡️ Extension Popup

![Extension Popup](screenshots/01-popup-dashboard.png)

---

## 📊 Analytics Dashboard

![Analytics Dashboard](screenshots/02-analytics-dashboard.png)

---

## ⚙️ Settings Page

![Settings Page](screenshots/03-settings-page.png)

---

# 🚀 Installation

## Clone the Repository

```bash
git clone https://github.com/Ejojaneesh/Trackershield.git
```

## Load the Extension

1. Open Google Chrome.
2. Navigate to:

```
chrome://extensions
```

3. Enable **Developer Mode**.
4. Click **Load unpacked**.
5. Select the TrackerShield project folder.
6. The extension is now ready to use.

---

# 📂 Project Structure

```text
TrackerShield/
│
├── assets/
├── icons/
├── screenshots/
│   ├── 01-popup-dashboard.png
│   ├── 02-analytics-dashboard.png
│   └── 03-settings-page.png
│
├── analytics.css
├── analytics.html
├── analytics.js
│
├── background.js
├── generate_rules.js
│
├── manifest.json
│
├── options.css
├── options.html
├── options.js
│
├── popup.css
├── popup.html
├── popup.js
│
├── rules.json
├── trackers.txt
│
├── README.md
├── LICENSE
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
└── .gitignore
```

---

# 🏗️ System Architecture

```text
                 User
                   │
                   ▼
            Popup Interface
                   │
      ┌────────────┼────────────┐
      ▼            ▼            ▼
 Analytics     Settings     Background
                                   │
                                   ▼
                  Declarative Net Request API
                                   │
                                   ▼
                      Chrome Storage API
                                   │
                                   ▼
                        Statistics Engine
```

---

# 📊 Analytics

TrackerShield records:

- Total blocked trackers
- Today's blocked trackers
- Protected websites
- Top blocked domains
- Activity log

All statistics are stored locally.

---

# 🔒 Privacy

TrackerShield **does not**

- Collect personal information
- Store browsing history remotely
- Upload user data
- Use external tracking services

All information remains on the user's device using Chrome Storage API.

---

# 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Chrome Manifest V3
- Chrome Storage API
- Declarative Net Request API

---

# 📦 Current Version

```text
TrackerShield v1.2.0
```

---

# 🗺️ Roadmap

Future improvements:

- Dark Mode
- Import Backup
- Cloud Synchronization
- Weekly Reports
- Custom Blocking Rules
- Tracker Categories
- Performance Dashboard
- Chrome Web Store Release

---

# 🤝 Contributing

Contributions are welcome.

Please read **CONTRIBUTING.md** before submitting Pull Requests.

---

# 🔐 Security

If you discover a security issue, please refer to **SECURITY.md**.

---

# 📄 License

This project is licensed under the **MIT License**.

See the **LICENSE** file for details.

---

# 👨‍💻 Author

**Ejo Janeesh**

Cybersecurity Project

TrackerShield v1.2.0

---

⭐ If you found this project useful, consider giving the repository a star.