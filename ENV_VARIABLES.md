# Environment Variables Reference

## Server (ag-ui-server)

### Required Variables

| Variable | Description | Where to Set | Example |
|----------|-------------|--------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key for GPT-4o access | Vercel Dashboard → Project Settings → Environment Variables | `sk-proj-...` |

### Local Development
Create `ag-ui-server/.env`:
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

### Production (Vercel)
Set in Vercel Dashboard:
1. Go to your server project
2. Settings → Environment Variables
3. Add `OPENAI_API_KEY` with your key
4. Select "Production" environment
5. Save and redeploy

---

## Client

### Required Variables

| Variable | Description | Where to Set | Example |
|----------|-------------|--------------|---------|
| `VITE_API_URL` | URL of your deployed backend server | Vercel Dashboard → Project Settings → Environment Variables | `https://ag-ui-server.vercel.app` |

### Local Development
Create `client/.env`:
```env
# For local development with local server
VITE_API_URL=http://localhost:3001

# OR for local development with production server
# VITE_API_URL=https://your-server-name.vercel.app
```

### Production (Vercel)
Set in Vercel Dashboard:
1. Go to your client project
2. Settings → Environment Variables
3. Add `VITE_API_URL` with your deployed server URL
4. Select "Production" environment
5. Save and redeploy

---

## Important Notes

### For Vite (Client)
- All environment variables MUST be prefixed with `VITE_` to be accessible in the browser
- Variables are embedded at build time, not runtime
- Changing variables requires a rebuild/redeploy

### Security
- Never commit `.env` files to git (already in `.gitignore`)
- Never expose `OPENAI_API_KEY` in client-side code
- Rotate keys if accidentally exposed
- Use Vercel's encrypted environment variables

### Vercel Environment Types
- **Production**: Used for production deployments
- **Preview**: Used for preview deployments (PR branches)
- **Development**: Used for local development with `vercel dev`

---

## Quick Setup Checklist

### Server Deployment
- [ ] `OPENAI_API_KEY` set in Vercel
- [ ] Server deployed successfully
- [ ] Test endpoint: `curl https://your-server.vercel.app/api/chat`

### Client Deployment
- [ ] Server URL copied
- [ ] `VITE_API_URL` set in Vercel (pointing to server)
- [ ] Client deployed successfully
- [ ] Test in browser: Chat functionality works

---

## Troubleshooting

### "Server is missing OpenAI API Key" error
- Check that `OPENAI_API_KEY` is set in Vercel server project
- Redeploy the server after adding the variable

### "Error connecting to server" in client
- Verify `VITE_API_URL` is set correctly
- Ensure URL has no trailing slash
- Check that server is deployed and running
- Verify CORS is enabled (already configured in server code)

### Changes not reflecting
- Vite variables are build-time, not runtime
- Redeploy after changing environment variables
- Clear browser cache if needed
