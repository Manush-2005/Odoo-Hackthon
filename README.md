#  Odoo Expense Management System

A modern, responsive expense management application built with React and Material-UI, featuring multi-step expense submission, real-time currency conversion, and role-based dashboards.

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![React Version](https://img.shields.io/badge/React-18.3-blue)
![Material UI](https://img.shields.io/badge/Material%20UI-6.1-purple)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 🌟 Features

###  **Multi-Role Dashboard System**
- **Admin Dashboard**: Complete system overview with analytics, user management, and approval rules
- **Manager Dashboard**: Team expense oversight, approval workflows, and reporting
- **Employee Dashboard**: Personal expense tracking, submission history, and quick actions

### 💰 **Advanced Expense Management**
- **Multi-Step Form**: Intuitive 3-step expense submission process
- **Real-Time Currency Conversion**: Support for 150+ currencies with live exchange rates
- **Receipt Upload**: Drag-and-drop file upload with multiple format support
- **Smart Validation**: Form validation with helpful error messages
- **Expense Categories**: Predefined categories for better organization

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach with Material-UI components
- **Dark/Light Theme**: Seamless theme switching with persistent preferences
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Accessibility**: WCAG compliant with keyboard navigation support

### 🔐 **Authentication & Security**
- **Role-Based Access Control**: Secure route protection based on user roles
- **JWT Authentication**: Token-based authentication system
- **Protected Routes**: Automatic redirection for unauthorized access

## Quick Start

### Prerequisites

- **Node.js** (v16.0 or higher)
- **npm** or **yarn**
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pushkar111/Odoo-Hackthon.git
   cd Odoo-Hackthon-expense
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in client directory
   VITE_API_BASE_URL=http://localhost:3001
   VITE_CURRENCY_API_URL=https://api.exchangerate-api.com/v4/latest
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@company.com | password123 |
| Manager | manager@company.com | password123 |
| Employee | employee@company.com | password123 |

## 🏗️ Project Structure

```
Odoo-Hackthon-expense/
├── client/                          # React frontend application
│   ├── public/                      # Static assets
│   │   ├── images/                  # UI images and icons
│   │   └── logo.png                 # Application logo
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Layout.jsx           # Main layout wrapper
│   │   │   ├── ModernSidebar.jsx    # Navigation sidebar
│   │   │   ├── ProtectedRoute.jsx   # Route protection
│   │   │   └── ui/                  # UI components
│   │   ├── context/                 # React Context providers
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   └── ThemeContext.jsx     # Theme management
│   │   ├── pages/                   # Application pages
│   │   │   ├── auth/                # Authentication pages
│   │   │   ├── admin/               # Admin dashboard pages
│   │   │   ├── manager/             # Manager dashboard pages
│   │   │   ├── employee/            # Employee dashboard pages
│   │   │   └── common/              # Shared pages
│   │   ├── utils/                   # Utility functions
│   │   │   ├── api.js              # API configurations
│   │   │   └── helpers.js          # Helper functions
│   │   ├── styles/                  # Custom styling
│   │   └── theme/                   # Material-UI theme
│   ├── package.json                 # Dependencies and scripts
│   └── vite.config.js              # Vite configuration
└── README.md                        # Project documentation
```

## 🎯 Core Functionalities

### � **Expense Submission Workflow**

1. **Step 1: Expense Details**
   - Title and description
   - Amount with currency selection
   - Category and date selection
   - Real-time currency conversion

2. **Step 2: Receipt Upload**
   - Drag-and-drop file upload
   - Support for JPG, PNG, PDF formats
   - File size validation (max 10MB)

3. **Step 3: Review & Submit**
   - Complete expense summary
   - Conversion details for foreign currencies
   - Final submission with confirmation

### 🔄 **Approval Process**

- **Employee** submits expense → **Pending** status
- **Manager** reviews and approves/rejects
- **Admin** has full oversight and control
- Automatic notifications and status updates

### 📊 **Dashboard Features**

#### Admin Dashboard
- System-wide expense analytics
- User management with role assignment
- Approval rules configuration
- Comprehensive reporting

#### Manager Dashboard
- Team expense overview
- Pending approvals queue
- Budget tracking and alerts
- Team performance metrics

#### Employee Dashboard
- Personal expense history
- Quick expense submission
- Status tracking
- Monthly summaries

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Material-UI (MUI)** - Comprehensive React component library
- **Framer Motion** - Animation library for smooth transitions
- **React Hook Form** - Performant form library with validation
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **React Toastify** - Toast notifications

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting
- **Git** - Version control

### External APIs
- **REST Countries API** - Currency and country data
- **Exchange Rate API** - Real-time currency conversion

## 🌐 API Integration

### Currency Services
```javascript
// Real-time currency conversion
const convertedAmount = await currencyApi.convertCurrency(
  amount, 
  fromCurrency, 
  toCurrency
);

// Get all available currencies
const currencies = await currencyApi.getCountriesWithCurrencies();
```

### Mock API Endpoints
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signup` - User registration
- `GET /api/expenses` - Fetch expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `GET /api/users` - User management

## 🎨 Design System

### Color Palette
- **Primary**: `#714B67` (Purple)
- **Secondary**: `#4ADE80` (Green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)
- **Info**: `#3B82F6` (Blue)

### Typography
- **Font Family**: Inter, sans-serif
- **Headings**: 600-700 font weight
- **Body**: 400-500 font weight
- **Responsive**: Scales from mobile to desktop

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover effects
- **Forms**: Clean inputs with validation states
- **Navigation**: Intuitive sidebar with active states

## 📱 Responsive Breakpoints

```css
Mobile: 0-600px (xs)
Tablet: 600-960px (sm)
Desktop: 960-1280px (md)
Large: 1280-1920px (lg)
Extra Large: 1920px+ (xl)
```

## 🔧 Configuration

### Environment Variables
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
VITE_CURRENCY_API_URL=https://api.exchangerate-api.com/v4/latest

# Feature Flags
VITE_ENABLE_DARK_MODE=true
VITE_ENABLE_CURRENCY_CONVERSION=true
```

### Build Configuration
```javascript
// vite.config.js
export default {
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    open: true
  }
}
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## 🧪 Testing

### Running Tests
```bash
# Unit tests
npm test

# Coverage report
npm run test:coverage

# End-to-end tests
npm run test:e2e
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Use conventional commit messages

## 🐛 Troubleshooting

### Common Issues

#### Currency API Not Loading
```bash
# Check network connection
# Verify API endpoint in .env file
# Check browser console for CORS issues
```

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Styling Issues
```bash
# Clear browser cache
# Check theme context provider
# Verify Material-UI theme configuration
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Frontend Developer**: React/Material-UI Implementation
- **UI/UX Designer**: User Interface and Experience Design
- **Backend Developer**: API Integration and Data Management

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the excellent component library
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [REST Countries](https://restcountries.com/) for currency data
- [Exchange Rate API](https://exchangerate-api.com/) for currency conversion
- [React Hook Form](https://react-hook-form.com/) for form management

## 📞 Support

For support and questions:
- 📧 Email: support@expense-manager.com
- � Issues: [GitHub Issues](https://github.com/Pushkar111/Odoo-Hackthon/issues)
- 📚 Documentation: [Wiki](https://github.com/Pushkar111/Odoo-Hackthon/wiki)

---

<div align="center">
  <p>Made with ❤️ for Odoo Hackathon</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>

### **Core Framework**
- **React 19.1.1** - Latest React with concurrent features
- **React Router DOM** - Client-side routing with protected routes
- **JavaScript ES6+** - Modern JavaScript features

### **UI/UX Libraries**
- **Material-UI (MUI)** - Enterprise-grade component library
- **shadcn/ui** - Modern component system
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **GSAP** - High-performance animations
- **Lottie React** - Beautiful micro-interactions

### **Form Management**
- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - TypeScript-first schema validation

### **State Management & APIs**
- **React Context** - Global state management
- **Axios** - HTTP client for API calls
- **Mock API** - Complete backend simulation

### **Developer Experience**
- **Vite** - Lightning-fast build tool
- **ESLint** - Code quality enforcement
- **React Toastify** - User feedback notifications

## 🎨 Design System

### **Ultra-Modern UI Features**
- **Glassmorphism Effects** - Translucent cards with backdrop blur
- **Dark/Light Theme** - System-wide theme switching
- **Responsive Design** - Pixel-perfect on all devices
- **Smooth Animations** - Framer Motion powered transitions
- **Professional Typography** - Carefully crafted text hierarchy
- **Consistent Spacing** - Systematic layout principles

### **Color Palette**
- **Primary**: Blue gradient (#3b82f6 to #1d4ed8)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)  
- **Error**: Red (#ef4444)
- **Surface**: Dynamic based on theme

## 🚀 Getting Started

### **Prerequisites**
- Node.js 20.19+ or 22.12+ (recommended)
- npm or yarn package manager

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Odoo-Hackthon-expense
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open application**
   ```
   http://localhost:5173
   ```

### **Demo Credentials**

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@company.com | admin123 | Full system access |
| **Manager** | manager@company.com | manager123 | Approval workflow |
| **Employee** | employee@company.com | employee123 | Expense submission |

## 📁 Project Structure

```
client/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # shadcn/ui components  
│   │   ├── Layout.jsx     # Main application layout
│   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   └── ProtectedRoute.jsx # Route protection
│   ├── context/           # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state
│   │   └── ThemeContext.jsx   # Theme management
│   ├── pages/             # Application pages
│   │   ├── auth/          # Authentication pages
│   │   ├── admin/         # Admin dashboard & management
│   │   ├── manager/       # Manager dashboard & approvals
│   │   ├── employee/      # Employee dashboard & submission
│   │   └── common/        # Shared pages
│   ├── utils/             # Utility functions
│   │   ├── api.js         # API endpoints & mock data
│   │   └── helpers.js     # Helper functions
│   ├── hooks/             # Custom React hooks
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── package.json          # Dependencies & scripts
└── vite.config.js        # Vite configuration
```

## 🔧 Key Features Deep Dive

### **1. Authentication & Security**
- JWT-style token simulation
- Role-based access control (RBAC)
- Protected route components
- Automatic token refresh simulation
- Secure logout with cleanup

### **2. Expense Submission Workflow**
```
Step 1: Basic Information → Step 2: Financial Details → Step 3: Review & Submit
```
- **Step 1**: Title, description, category selection
- **Step 2**: Amount, currency, date, receipt upload
- **Step 3**: Review with conversion rates, final submission

### **3. Approval Management**
- **Bulk Operations**: Select multiple expenses for batch approval
- **Detailed Review**: Full expense context with receipts
- **Comment System**: Rejection reasons and approval notes
- **Status Tracking**: Real-time status updates across the system

### **4. Currency System**
- **Live Exchange Rates**: Real-time conversion using external APIs
- **Multi-Currency Support**: 150+ supported currencies
- **Base Currency**: Company-level base currency settings
- **Conversion History**: Track exchange rates at submission time

### **5. Data Management**
- **Mock Backend**: Complete API simulation with realistic data
- **Local Storage**: Persistent user sessions and preferences
- **State Management**: Efficient React Context usage
- **Caching**: Smart data caching for performance

## 🎯 User Workflows

### **Admin Workflow**
1. **Dashboard Overview** → View system-wide statistics
2. **User Management** → Create/edit users and assign roles
3. **Approval Rules** → Configure approval policies
4. **System Monitoring** → Track usage and performance

### **Manager Workflow**  
1. **Pending Reviews** → View expenses awaiting approval
2. **Detailed Review** → Examine expense details and receipts
3. **Approval Decision** → Approve or reject with comments
4. **Team Analytics** → Monitor team expense patterns

### **Employee Workflow**
1. **Expense Creation** → Submit new expense through guided flow
2. **Status Tracking** → Monitor approval progress
3. **History Review** → Access past submissions and approvals
4. **Receipt Management** → Upload and manage expense receipts

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: 320px - 767px (Full mobile optimization)
- **Tablet**: 768px - 1023px (Touch-friendly interface)
- **Desktop**: 1024px+ (Full-featured experience)

### **Mobile Features**
- Collapsible sidebar navigation
- Touch-optimized form controls
- Responsive data tables with horizontal scroll
- Mobile-first component design

## 🚀 Performance Optimizations

### **Code Splitting**
- Route-based code splitting
- Lazy loading of non-critical components
- Dynamic imports for heavy libraries

### **Bundle Optimization**
- Tree shaking for unused code elimination
- Vite's optimized build pipeline
- Modern browser targeting

### **State Management**
- Efficient React Context usage
- Minimal re-renders with proper dependencies
- Local component state where appropriate

## 🔮 Future Enhancements

### **Phase 1: Advanced Features**
- [ ] Real backend integration with REST/GraphQL APIs
- [ ] Advanced reporting and analytics dashboard
- [ ] Email notifications for approval workflows
- [ ] Advanced file upload with cloud storage

### **Phase 2: Enterprise Features**
- [ ] Advanced user management with department hierarchy
- [ ] Custom approval workflows with multiple approval levels
- [ ] Integration with accounting systems (QuickBooks, SAP)
- [ ] Advanced reporting with data export capabilities

### **Phase 3: Advanced Analytics**
- [ ] Machine learning expense categorization
- [ ] Predictive budget analytics
- [ ] Advanced fraud detection algorithms
- [ ] Custom dashboard builder

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Development Guidelines

### **Code Standards**
- ES6+ JavaScript with modern syntax
- Functional components with hooks
- Consistent naming conventions
- Comprehensive error handling

### **Component Structure**
```jsx
// 1. Imports (external libraries first, then internal)
// 2. Component definition with destructured props
// 3. State and effect hooks
// 4. Helper functions
// 5. Event handlers
// 6. Render logic with early returns
// 7. Export statement
```

### **Styling Approach**
- Material-UI's `sx` prop for component styling
- Tailwind classes for utility styling
- Consistent spacing and typography scale
- Dark/light theme considerations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- **Material-UI Team** for the exceptional component library
- **React Team** for the amazing framework
- **Vite Team** for the lightning-fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations

---

## 📞 Support

For support, questions, or feature requests:
- 📧 Email: support@expense-system.com
- 💬 Discord: [Join our community](#)
- 📚 Documentation: [Full documentation](#)

---

**Built with ❤️ for the Odoo Hackathon**

*Creating the future of expense management, one line of code at a time.*
