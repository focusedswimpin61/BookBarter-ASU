# BookBarter ASU

<p align="center">
  <img src="public/images/asu-logo.png" alt="ASU Logo" width="150">
</p>

<p align="center">
  A textbook exchange platform built by Sun Devils, for Sun Devils.
</p>

## 📚 Overview

BookBarter ASU is a peer-to-peer textbook exchange platform designed specifically for Arizona State University students. The platform allows students to buy, sell, and exchange textbooks directly with fellow students, saving money and reducing waste.

## 🚀 Live Demo

[https://bookbarter-asu.vercel.app](https://v0-book-barter-asu-project.vercel.app/

## ✨ Key Features

- **User Authentication**: Secure login and registration system for ASU students
- **Textbook Listings**: Browse, search, and filter available textbooks
- **Course-Specific Search**: Find textbooks by course code
- **Real-time Updates**: Get notified when new books are listed or when someone is interested in your books
- **Market Analytics**: View price trends and demand for textbooks
- **Responsive Design**: Fully functional on mobile, tablet, and desktop devices
- **Dark Mode Support**: Toggle between light and dark themes

## 🛠️ Technologies Used

### Frontend
- **Next.js 13** (App Router): React framework for server-side rendering and static site generation
- **React 18**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript for better developer experience
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **Shadcn UI**: Reusable UI components built with Radix UI and Tailwind
- **Lucide React**: Beautiful, consistent icons

### Backend & Data
- **Next.js API Routes**: Serverless functions for backend logic
- **Server Actions**: For form handling and data mutations
- **Local Storage**: For demo data persistence
- **Supabase**: For authentication and database (planned integration)

### DevOps & Deployment
- **Vercel**: Hosting and deployment platform
- **GitHub**: Version control and project management

## 🏗️ Architecture

BookBarter ASU follows a modern architecture with:

- **Server Components**: For data fetching and SEO
- **Client Components**: For interactive UI elements
- **Server Actions**: For form submissions and data mutations
- **Responsive Design**: Mobile-first approach
- **Theme Support**: Light and dark mode

## 📋 Features in Detail

### For Buyers
- Search for textbooks by title, course code, or description
- Filter by price range, condition, and category
- Contact sellers directly through the platform
- Add books to favorites for later reference

### For Sellers
- List textbooks with details like condition, price, and course code
- Upload images of textbooks
- Mark books as sold when transactions are complete
- Manage all listings in one dashboard

### Analytics
- View market trends for textbook prices
- See demand for specific courses and textbooks
- Get recommendations for pricing your textbooks

## 🔧 Setup and Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Local Development
1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/bookbarter-asu.git
   cd bookbarter-asu
