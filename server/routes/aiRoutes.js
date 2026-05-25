import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post(
  "/generate-docs",
  async (req, res) => {

    try {

      const { repoUrl } = req.body;

      // =========================
      // Extract owner/repo
      // =========================

      const match =
        repoUrl.match(
          /github\.com\/([^/]+)\/([^/]+)/
        );

      if (!match) {

        return res.status(400).json({

          success: false,
          message: "Invalid GitHub URL"
        });
      }

      const owner = match[1];

      const repo = match[2];

      // =========================
      // Fetch Repo Details
      // =========================

      const repoResponse =
        await axios.get(

          `https://api.github.com/repos/${owner}/${repo}`
        );

      const repoData =
        repoResponse.data;

      // =========================
      // Fetch Repo Contents
      // =========================

      const contentsResponse =
        await axios.get(

          `https://api.github.com/repos/${owner}/${repo}/contents`
        );

      const contents =
        contentsResponse.data;

      let techStack = [];

      // =========================
      // Detect package.json
      // =========================

      const packageFile =
        contents.find(

          (file) =>
            file.name === "package.json"
        );

      if (
        packageFile &&
        packageFile.download_url
      ) {

        try {

          const packageResponse =
            await axios.get(
              packageFile.download_url
            );

          const packageJson =
            packageResponse.data;

          const dependencies = {

            ...packageJson.dependencies,
            ...packageJson.devDependencies
          };

          // Frontend
          if (dependencies.react)
            techStack.push("React");

          if (dependencies.vue)
            techStack.push("Vue");

          if (dependencies.angular)
            techStack.push("Angular");

          if (dependencies.next)
            techStack.push("Next.js");

          if (dependencies.tailwindcss)
            techStack.push("Tailwind CSS");

          // Backend
          if (dependencies.express)
            techStack.push("Express.js");

          if (dependencies.nestjs)
            techStack.push("NestJS");

          // Database
          if (dependencies.mongodb)
            techStack.push("MongoDB");

          if (dependencies.mongoose)
            techStack.push("Mongoose");

          if (dependencies.pg)
            techStack.push("PostgreSQL");

          if (dependencies.mysql)
            techStack.push("MySQL");

          // Tools
          if (dependencies.typescript)
            techStack.push("TypeScript");

          if (dependencies.firebase)
            techStack.push("Firebase");

          if (dependencies.docker)
            techStack.push("Docker");

        } catch (err) {

          console.log(
            "package.json parsing failed"
          );
        }
      }

      // =========================
      // Detect Python
      // =========================

      const requirementsFile =
        contents.find(

          (file) =>
            file.name === "requirements.txt"
        );

      if (
        requirementsFile &&
        requirementsFile.download_url
      ) {

        try {

          const reqResponse =
            await axios.get(
              requirementsFile.download_url
            );

          const requirements =
            reqResponse.data.toLowerCase();

          if (
            requirements.includes("flask")
          ) {

            techStack.push("Flask");
          }

          if (
            requirements.includes("django")
          ) {

            techStack.push("Django");
          }

          if (
            requirements.includes("opencv")
          ) {

            techStack.push("OpenCV");
          }

          if (
            requirements.includes("tensorflow")
          ) {

            techStack.push("TensorFlow");
          }

          if (
            requirements.includes("torch")
          ) {

            techStack.push("PyTorch");
          }

        } catch (err) {

          console.log(
            "requirements.txt parsing failed"
          );
        }
      }

      // =========================
      // Fallback Detection
      // =========================

      if (
        repoData.language &&
        !techStack.includes(
          repoData.language
        )
      ) {

        techStack.push(
          repoData.language
        );
      }

      // Remove duplicates
      techStack =
        [...new Set(techStack)];

      // =========================
      // AI Prompt
      // =========================

      const prompt = `
You are a senior software architect and technical documentation expert.

Analyze this GitHub repository:

${repoUrl}

Generate PROFESSIONAL MARKDOWN DOCUMENTATION.

VERY IMPORTANT RULES:
- Use proper markdown syntax
- Use headings with #
- Use bullet points with -
- Use code blocks with \`\`\`
- Use spacing properly
- Make documentation visually clean
- Never write plain paragraphs only
- Never write "Not detected"

FORMAT STRICTLY LIKE THIS:

# Project Overview

Explain the project professionally.

# Core Features

- Feature 1
- Feature 2
- Feature 3

# Technology Stack

- React
- Node.js
- MongoDB

# Frontend Framework

Explain frontend stack.

# Backend Framework

Explain backend stack.

# Database Used

Explain database.

# Dependencies & Libraries

- Express.js
- Axios
- Mongoose

# Installation Steps

\`\`\`bash
npm install
npm run dev
\`\`\`

# Usage Instructions

Explain usage.

# Folder Structure

\`\`\`
client/
server/
routes/
models/
\`\`\`

# API Endpoints

- GET /api/example
- POST /api/example

# Deployment Process

Explain deployment.

# Architecture Overview

Explain architecture professionally.

# Security Considerations

- Authentication
- Validation
- Encryption

# Performance Considerations

- Lazy loading
- Optimization
- API efficiency

# Future Improvements

- Authentication
- Multi-language support
- Analytics

# Contribution Guide

Explain contribution process.

Generate hackathon-quality documentation.
`;

      // =========================
      // OPENROUTER API
      // =========================

      const response =
  await axios.post(

    "https://openrouter.ai/api/v1/chat/completions",

    {
      model: "openai/gpt-3.5-turbo",

      messages: [

        {
          role: "user",
          content: prompt
        }
      ]
    },

    {
      headers: {

        Authorization:
          `Bearer ${process.env.OPENROUTER_API_KEY}`,

        "Content-Type":
          "application/json"
      }
    }
  );

      const documentation =
  response.data
  .choices[0]
  .message
  .content;

      // =========================
      // Send Response
      // =========================

      res.status(200).json({

        success: true,

        documentation,

        techStack,

        repoData
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message: "AI generation failed"
      });
    }
  }
);

export default router;