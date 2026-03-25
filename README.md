# Todo List Application

A modern, interactive todo list application built with React and Vite, featuring drag-and-drop functionality and a clean user interface.

## Features

- Create and manage todo items
- Drag-and-drop task organization
- Responsive design with Tailwind CSS
- Fast development experience with Vite
- Modern React 19 implementation

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **@hello-pangea/dnd** - Drag and drop functionality
- **React Router** - Navigation
- **React Icons** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd todo-list
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── Component/
│   └── HomePage/
│       ├── GroupHome.jsx    # Main container component
│       ├── Home.jsx          # Home view
│       ├── Place.jsx         # Task placement component
│       └── SideBar.jsx       # Navigation sidebar
├── assets/                   # Static assets
├── App.jsx                   # Root component
├── main.jsx                  # Application entry point
└── index.css                 # Global styles
```

## License

This project is private and not licensed for public use.
