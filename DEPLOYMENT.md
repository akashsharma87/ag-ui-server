# AG-UI Server Deployment Guide

## Deploying to Vercel

### Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Vercel CLI installed (optional): `npm i -g vercel`

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub** (if not already done)
   ```bash
   cd ag-ui-server
   git init
   git add .
   git commit -m "Initial server commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import Project in Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select the `ag-ui-server` directory as the root directory
   - Vercel will auto-detect the Node.js project

3. **Configure Environment Variables**
   - In the Vercel project settings, go to "Environment Variables"
   - Add the following variable:
     - Name: `OPENAI_API_KEY`
     - Value: Your OpenAI API key
     - Environment: Production (and Preview if needed)

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy your deployment URL (e.g., `https://your-server-name.vercel.app`)

### Option 2: Deploy via CLI

1. **Install Vercel CLI** (if not installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from the server directory**
   ```bash
   cd ag-ui-server
   vercel
   ```

4. **Add environment variables**
   ```bash
   vercel env add OPENAI_API_KEY
   ```
   Then paste your OpenAI API key when prompted.

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Testing Your Deployment

Test your API endpoint:
```bash
curl -X POST https://your-server-name.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "history": []}'
```

### Important Notes

- The server runs as a serverless function on Vercel
- Each request has a maximum execution time (10 seconds on free tier, 60 seconds on Pro)
- Environment variables are configured in Vercel dashboard, not in `.env` file
- The `.env` file is only for local development and is gitignored

### Troubleshooting

If deployment fails:
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify `vercel.json` configuration is correct
4. Make sure environment variables are set in Vercel dashboard
