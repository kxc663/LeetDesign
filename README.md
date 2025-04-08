# LeetDesign

LeetDesign is an open-source platform designed to help students and engineers systematically practice System Design problems. The platform offers a curated problem bank, guided thinking prompts, detailed reference solutions, and personal progress tracking.

## 📚 Overview

System design interviews have become a critical part of the technical interview process for software engineers, especially for mid to senior-level positions. Unlike coding interviews, system design questions are open-ended and require a deep understanding of distributed systems, scalability, and reliability.

LeetDesign aims to provide a structured approach to learning system design with the following features:

## ✨ Core Features

- **System Design Problem Bank**: Browse and search a curated list of system design problems categorized by difficulty.
- **Answer Writing Workspace**: Draft and organize your solutions using a clean markdown editor.
- **Reference Solutions & Hints**: Unlock step-by-step hints and compare your design against expert reference answers.
- **User Authentication & Progress Tracking**: Log in via Google or GitHub. Track which problems you have attempted and completed.
- **Future Features**: Discussion forum for sharing ideas and getting feedback.

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with Google and GitHub providers
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB connection (local or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/kxc663/LeetDesign.git
   cd LeetDesign
   ```

2. Install dependencies:
   ```
   cd leetdesign
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the `leetdesign` directory with the following variables:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_random_string_here
   
   # MongoDB
   MONGODB_URI=your_mongodb_connection_string
   
   # OAuth providers
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   GITHUB_ID=your_github_client_id
   GITHUB_SECRET=your_github_client_secret

   # JWT
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🧪 Project Structure

```
leetdesign/
├── public/              # Static assets
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── api/         # API routes
│   │   ├── pages/       # Application pages
│   │   │   ├── problems/    # Problem listing and details
│   │   │   ├── login/       # Authentication pages
│   │   │   ├── signup/      # User registration
│   │   │   └── about/       # About page
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utility functions and libraries
│   └── models/          # MongoDB models
├── .env                 # Environment variables (not in repo)
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
└── tailwind.config.js   # Tailwind CSS configuration
```

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the need for structured system design practice
- Built with the amazing Next.js and React ecosystem
- Styled with TailwindCSS

---

Made with ❤️ by LeetDesign Team
