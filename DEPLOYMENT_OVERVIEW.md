# AG-UI Demo - Deployment Guide

This project consists of two separate applications that need to be deployed independently:

1. **ag-ui-server** - Backend API (Express + OpenAI)
2. **client** - Frontend UI (React + Vite)

## Quick Start Deployment

### Step 1: Deploy the Server First

The client depends on the server, so deploy the server first:

```bash
cd ag-ui-server
```

Follow the instructions in [`ag-ui-server/DEPLOYMENT.md`](./ag-ui-server/DEPLOYMENT.md)

**Important:** Save your deployed server URL (e.g., `https://your-server-name.vercel.app`)

### Step 2: Deploy the Client

Once the server is deployed:

```bash
cd client
```

Follow the instructions in [`client/DEPLOYMENT.md`](./client/DEPLOYMENT.md)

Make sure to set the `VITE_API_URL` environment variable to your deployed server URL.

## Deployment Architecture

```
┌─────────────────┐
│   Vercel CDN    │  ← Client (Static Site)
│   (Frontend)    │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│ Vercel Function │  ← Server (Serverless)
│   (Backend)     │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│   OpenAI API    │
└─────────────────┘
```

## Environment Variables Summary

### Server (ag-ui-server)
- `OPENAI_API_KEY` - Your OpenAI API key

### Client
- `VITE_API_URL` - URL of your deployed server (e.g., `https://your-server-name.vercel.app`)

## Deployment Options

### Option A: Separate GitHub Repositories (Recommended)

Create two separate repositories:
- `ag-ui-server` repository
- `ag-ui-client` repository

Deploy each independently on Vercel.

### Option B: Monorepo with Different Branches

1. Create a `server` branch for the server code
2. Create a `client` branch for the client code
3. Deploy each branch as a separate Vercel project

### Option C: Monorepo with Root Directory Configuration

Keep both in the same repository and configure Vercel to use different root directories:
- Server project: Root directory = `ag-ui-server`
- Client project: Root directory = `client`

## Local Development

### Running Both Locally

1. **Start the server:**
   ```bash
   cd ag-ui-server
   npm install
   npm start
   ```
   Server runs on `http://localhost:3001`

2. **Start the client (in a new terminal):**
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Client runs on `http://localhost:5173`

### Testing with Production Server

To test the client locally with the production server:

1. Update `client/.env`:
   ```
   VITE_API_URL=https://your-server-name.vercel.app
   ```

2. Run the client:
   ```bash
   cd client
   npm run dev
   ```

## Troubleshooting

### CORS Issues
- Ensure the server has CORS enabled (already configured)
- Check that the client is using the correct API URL

### Build Failures
- Check Vercel build logs
- Ensure all dependencies are listed in `package.json`
- Try building locally first

### API Connection Issues
- Verify environment variables are set correctly in Vercel
- Test the server endpoint directly
- Check browser console for errors

## Security Notes

- Never commit `.env` files to git (already in `.gitignore`)
- Set environment variables in Vercel dashboard, not in code
- Rotate your OpenAI API key if it's accidentally exposed
- Use Vercel's environment variable encryption

## Cost Considerations

### Vercel Free Tier Limits
- 100 GB bandwidth per month
- Serverless function execution: 100 hours per month
- 10 second function timeout (60s on Pro)

### OpenAI API Costs
- GPT-4o pricing applies
- Monitor usage in OpenAI dashboard
- Set usage limits to avoid unexpected charges

## Next Steps

1. Deploy the server following `ag-ui-server/DEPLOYMENT.md`
2. Deploy the client following `client/DEPLOYMENT.md`
3. Test the deployed application
4. Set up custom domains (optional)
5. Configure analytics (optional)
6. Set up monitoring and error tracking (optional)

## Support

For issues:
- Check the deployment logs in Vercel dashboard
- Review the troubleshooting sections in individual DEPLOYMENT.md files
- Verify all environment variables are set correctly
