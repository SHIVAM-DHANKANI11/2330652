# Campus Notifications System - Production-Grade Frontend

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-purple.svg)](https://vitejs.dev/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.14.0-blue.svg)](https://mui.com/)
[![Axios](https://img.shields.io/badge/Axios-1.6.0-brightgreen.svg)](https://axios-http.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-grade, enterprise-level campus notifications system built with React, Vite, Material UI, and comprehensive logging. Features priority-based inbox, advanced filtering, and complete observability through structured logging.

## 🚀 Features

- **Priority Inbox**: Intelligent sorting by notification type (Placement=3, Result=2, Event=1)
- **Comprehensive Logging**: Structured JSON logging for all API calls, user actions, and system events
- **Advanced Filtering**: Filter by type, search functionality, pagination
- **Responsive Design**: Mobile, tablet, and desktop support
- **State Management**: Context API with useReducer for scalable state management
- **Material UI Components**: Professional, accessible UI components
- **Performance Optimized**: O(n log n) sorting, Top-N extraction, efficient pagination
- **Viewed Status Tracking**: localStorage-based notification viewed state management
- **Statistics Dashboard**: Real-time statistics and distribution visualization
- **Production Ready**: Error handling, API interceptors, performance tracking

## 📋 Prerequisites

- **Node.js**: 14.x or higher
- **npm**: 6.x or higher
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 🛠️ Installation

### 1. Clone & Navigate
```bash
cd notification_app_fe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your API configuration
# VITE_API_BASE_URL=http://4.224.186.213/evaluation-service
# VITE_LOG_LEVEL=info
# VITE_ENABLE_CONSOLE_LOGS=true
```

### 4. Development Server
```bash
npm run dev
```

Access the application at `http://localhost:3000`

## 📦 Project Structure

```
notification_app_fe/
├── src/
│   ├── middleware/
│   │   └── logger.js                    # Comprehensive logging middleware
│   ├── services/
│   │   ├── apiClient.js                 # Axios instance with interceptors
│   │   └── notificationService.js       # Notification API service
│   ├── utils/
│   │   ├── priorityUtils.js             # Priority calculation & sorting
│   │   ├── storageUtils.js              # localStorage management
│   │   ├── formatUtils.js               # Text & date formatting
│   │   └── paginationUtils.js           # Pagination helpers
│   ├── contexts/
│   │   └── NotificationContext.jsx      # Global state management
│   ├── hooks/
│   │   └── useNotifications.js          # Custom React hooks
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx               # Top navigation bar
│   │   │   ├── Sidebar.jsx              # Navigation drawer
│   │   │   └── MainLayout.jsx           # Main layout wrapper
│   │   ├── notification/
│   │   │   └── NotificationCard.jsx     # Individual notification card
│   │   └── common/
│   │       ├── NotificationFilter.jsx   # Filter & search component
│   │       ├── PaginationComponent.jsx  # Pagination controls
│   │       ├── StatisticsCard.jsx       # Statistics display
│   │       ├── AlertBanner.jsx          # Alert/banner component
│   │       └── SkeletonLoader.jsx       # Loading placeholder
│   ├── pages/
│   │   ├── DashboardPage.jsx            # Dashboard page
│   │   ├── NotificationsPage.jsx        # Notifications list
│   │   └── PriorityInboxPage.jsx        # Priority inbox
│   ├── App.jsx                          # Main app component
│   ├── main.jsx                         # Entry point
│   ├── theme.js                         # Material UI theme
│   └── index.css                        # Global styles
├── public/                              # Static assets
├── index.html                           # HTML template
├── package.json                         # Dependencies
├── vite.config.js                       # Vite configuration
└── .env.example                         # Environment template
```

## 🔍 Logging System

### Comprehensive Logging Coverage

All application events are logged with structured JSON format:

```javascript
{
  "timestamp": "2024-06-03T10:30:45.123Z",
  "sessionId": "session_1717401045123_abc123",
  "level": "INFO",
  "category": "API",
  "message": "API Request: GET /notifications",
  "userAgent": "Mozilla/5.0...",
  "method": "GET",
  "endpoint": "/notifications",
  "statusCode": 200,
  "responseTimeMs": 245,
  "success": true
}
```

### Logged Events

| Event | Category | Details |
|-------|----------|---------|
| **API Requests** | API | Method, endpoint, params, headers |
| **API Responses** | API | Status code, response time, data size |
| **Navigation** | NAVIGATION | From page, to page, timestamp |
| **Filter Changes** | FILTER | Applied filters, result count |
| **Search** | SEARCH | Search term, result count |
| **Pagination** | PAGINATION | Page, page size, total records |
| **User Actions** | USER_ACTION | Action type, action name, metadata |
| **Errors** | ERROR | Error message, stack trace, context |
| **Performance** | PERFORMANCE | Operation name, duration in ms |
| **Notifications Viewed** | VIEW | Notification ID, type, timestamp |

### Accessing Logs

**In Browser Console:**
```javascript
// View all logs
import { getSessionLogs } from './middleware/logger.js';
const logs = getSessionLogs();
console.log(logs);

// Export logs as JSON file
import { exportLogs } from './middleware/logger.js';
exportLogs(); // Downloads logs_[sessionId].json
```

**User Menu:**
Click the user profile icon → "Export Logs" to download session logs

## 📊 Priority Inbox Algorithm

### Priority Calculation

```
Priority Score = (TypeWeight × 1,000,000,000) + Timestamp
```

**Type Weights:**
- Placement: Weight 3 (Highest Priority)
- Result: Weight 2 (Medium Priority)
- Event: Weight 1 (Low Priority)

### Time Complexity Analysis

| Operation | Complexity | Notes |
|-----------|-----------|-------|
| Sort all notifications | O(n log n) | Standard comparison sort |
| Get top N | O(n log k) | Heap-based selection |
| Enrich with priority | O(n) | Single pass enrichment |
| Calculate scores | O(1) per item | Constant time score calculation |

### Example Sorting Result

```
1. Placement (3) - "Your application accepted" - 2024-06-03 10:45:00
2. Placement (3) - "Interview scheduled" - 2024-06-03 10:30:00
3. Result (2) - "Exam results published" - 2024-06-03 10:15:00
4. Result (2) - "Assignment graded" - 2024-06-03 09:30:00
5. Event (1) - "Campus event today" - 2024-06-03 08:00:00
```

## 🎯 State Management Architecture

### Context Structure

```javascript
{
  // Data
  notifications: [],              // Current page notifications
  priorityNotifications: [],      // Top N notifications
  
  // Pagination
  page: 1,
  pageSize: 10,
  totalRecords: 0,
  
  // Filters
  selectedType: null,            // 'Placement' | 'Result' | 'Event' | null
  searchTerm: '',
  
  // Priority Inbox
  topN: 10,                      // Configurable top N value
  
  // UI State
  loading: false,
  error: null,
  success: null,
  
  // Metadata
  lastFetch: null,
  totalNotifications: 0
}
```

### Data Flow

```
User Action
    ↓
Hook (useNotifications, usePagination, etc.)
    ↓
Dispatch Action to Reducer
    ↓
Update Context State
    ↓
Components Re-render
    ↓
Display Updated UI
```

## 📱 Responsive Design

### Breakpoints

| Device | Breakpoint | Width |
|--------|-----------|-------|
| Mobile | xs | 0px+ |
| Tablet | sm | 600px+ |
| Desktop | md | 960px+ |
| Large | lg | 1280px+ |
| Extra Large | xl | 1920px+ |

### Components Responsive Behavior

- **Header**: Fixed top, search adapts
- **Sidebar**: Drawer on mobile, permanent on desktop
- **Cards**: 1 column mobile, 2-4 columns on desktop
- **Pagination**: Compact on mobile, full on desktop
- **Filters**: Stacked on mobile, horizontal on desktop

## 🔌 API Integration

### Endpoints Configuration

**Base URL:** `http://4.224.186.213/evaluation-service`

### Notifications Endpoint

```http
GET /notifications
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (1-based) |
| `limit` | number | 10 | Items per page |
| `notification_type` | string | optional | Filter by type: Placement, Result, Event |

**Response Example:**

```json
[
  {
    "id": "12345e67-8901-f234-56g7-890123h45678",
    "title": "Placement Drive - Company A",
    "description": "Company A is visiting campus...",
    "notification_type": "Placement",
    "timestamp": "2024-06-03T10:45:00Z",
    "metadata": {}
  },
  ...
]
```

## 🚀 Performance Optimization

### Implemented Optimizations

1. **Lazy Loading**: Components load on demand
2. **Memoization**: useCallback for event handlers
3. **Efficient Sorting**: O(n log n) QuickSort
4. **Top-N Selection**: Heap operations for top N extraction
5. **Pagination**: Slice-based client-side pagination
6. **Request Debouncing**: Search input debouncing
7. **API Interceptors**: Request/response caching ready
8. **Skeleton Loading**: Shows placeholders during load

### Performance Metrics

- **Initial Load**: < 2 seconds
- **API Response**: < 500ms typical
- **Pagination**: < 100ms local filter + sort
- **Priority Calculation**: O(1) to O(n log n) depending on operation

## 🎨 Material UI Customization

### Theme Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #1976d2 | Main UI, buttons, links |
| Error | #d32f2f | Placement notifications, errors |
| Warning | #f57c00 | Result notifications |
| Info | #0288d1 | Event notifications |
| Success | #388e3c | Success actions |

### Custom Theme

Edit [src/theme.js](src/theme.js) to customize:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',        // Change primary color
      light: '#42a5f5',
      dark: '#1565c0'
    }
    // ... more customization
  }
});
```

## 📊 Statistics & Analytics

### Dashboard Metrics

- **Total Notifications**: Count of all notifications
- **Placement Count**: High-priority notifications
- **Result Count**: Medium-priority notifications
- **Event Count**: Low-priority notifications
- **Distribution Percentages**: Pie chart representation
- **Top N Notifications**: Highest priority items

### Priority Distribution Analysis

```javascript
analyzeNotificationDistribution(notifications)
// Returns:
{
  distribution: {
    Placement: { count: 15, weight: 3 },
    Result: { count: 8, weight: 2 },
    Event: { count: 22, weight: 1 }
  },
  total: 45,
  percentages: {
    Placement: "33.33%",
    Result: "17.78%",
    Event: "48.89%"
  }
}
```

## 🔐 Local Storage

### Stored Data

| Key | Type | Purpose |
|-----|------|---------|
| `viewed_notifications` | Array | IDs of viewed notifications |
| `notification_preferences` | Object | User preferences (topN, pageSize, etc.) |
| `last_sync_timestamp` | ISO String | Last API sync timestamp |
| `appLogs` | JSON Array | In-session logs (max 100 entries) |

### Local Storage Usage

```javascript
// Mark notification as viewed
markNotificationAsViewed('notification_123');

// Check if viewed
isNotificationViewed('notification_123'); // true/false

// Update preferences
updatePreference('topN', 15);

// Get all preferences
getPreferences();
```

## 🚢 Production Build

### Building for Production

```bash
npm run build
```

Outputs optimized bundle to [dist/](dist/) directory:

- **dist/index.html** - Minified HTML
- **dist/assets/index-[hash].js** - Bundled/minified JavaScript
- **dist/assets/index-[hash].css** - Minified CSS

### Production Deployment

```bash
# Build
npm run build

# Preview production build locally
npm run preview

# Deploy dist/ to your server
# Example: AWS S3, Netlify, Vercel, etc.
```

## 🔧 Development Commands

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: API calls return 404
- **Solution**: Verify `VITE_API_BASE_URL` in `.env` matches the actual API server

**Issue**: Notifications not loading
- **Solution**: Check browser console logs, check API endpoint connectivity

**Issue**: Sidebar not appearing on mobile
- **Solution**: This is expected behavior - sidebar becomes a drawer on mobile, click the menu icon

**Issue**: Logs not persisting
- **Solution**: Check if sessionStorage is enabled in browser settings

## 📖 Code Quality Standards

### Followed Principles

- **SOLID Principles**: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
- **DRY**: Reusable components and utilities
- **Clean Code**: Descriptive naming, modular structure
- **Performance**: Optimized algorithms, memoization
- **Accessibility**: ARIA labels, keyboard navigation
- **Documentation**: JSDoc comments, README

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Author

**Senior React Architect | Frontend Lead**
- Frontend Architecture Design
- Production-Grade Implementation
- Comprehensive Logging & Monitoring
- Performance Optimization

## 🙏 Acknowledgments

- React Documentation & Community
- Material-UI Component Library
- Axios HTTP Client
- Vite Build Tool
- React Router

## 📞 Support

For issues, questions, or suggestions, please open an issue in the repository.

---

**Last Updated**: June 3, 2024  
**Version**: 1.0.0 (Production Ready)
