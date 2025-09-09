# Outdoorable TripGuide Widget - Handoff Documentation

## Project Overview

Interactive Next.js widget that generates personalized trip guides using AI. Users complete questionnaires, receive custom recommendations, and get automatically added to GoHighLevel CRM. Embeds as iframe on any website.

## 1. Code & Hosting

### GitHub Repository
- Full commit history included
- Transfer to `ali@outdoorable.co` organization
- Repository: https://github.com/[current-org]/outdoor-next-js

### Local Development
```bash
pnpm install
pnpm dev      # Starts on http://localhost:3000
pnpm build    # Production build
pnpm start    # Runs production build
```

### Vercel Deployment
- Project linked to GitHub repository
- Auto-deployment on git push to main
- Transfer project to client Vercel account
- Domain: [production-url].vercel.app

## 2. Environment Variables & Secrets

### Required .env.example
```
# OpenAI Integration
OPENAI_API_KEY=sk-your-openai-key-here

# GoHighLevel CRM
GOHIGHLEVEL_API_KEY=your-ghl-api-key
GOHIGHLEVEL_LOCATION_ID=your-location-id

# Airtable Database
AIRTABLE_API_KEY=your-airtable-key
AIRTABLE_BASE_ID=your-base-id

# Optional
NODE_ENV=production
```

### Vercel Environment Setup
1. Navigate to Project → Settings → Environment Variables
2. Add all variables for Production, Preview, and Development
3. Redeploy after adding variables

### API Key Rotation Required
- ✅ OpenAI API key - rotate before handoff
- ✅ GoHighLevel API key - rotate before handoff  
- ✅ Airtable API key - rotate before handoff

## 3. Airtable Configuration

### Base Transfer
- Transfer ownership to `ali@outdoorable.co`
- Base Name: "Outdoorable Experts Database"
- Base ID: [current-base-id]

### Table Structure
#### Experts Table
- **Name** (Single line text)
- **Email** (Email)
- **Specialties** (Multiple select: Adventure, Cultural, Budget, Luxury, Family)
- **Regions** (Multiple select: North America, Europe, Asia, etc.)
- **Bio** (Long text)
- **Contact_Info** (Long text)
- **Active** (Checkbox)

#### Automations
- No current automations configured
- Expert matching handled via API calls in application

## 4. AI Logic & Prompts

### System Prompts Location
File: `src/lib/tripGuideGenerator.ts`

#### Inspire Me Flow Prompt
```typescript
const inspirePrompt = `You are an expert travel advisor...`
```

#### I Know Where Flow Prompt  
```typescript
const planningPrompt = `Create a detailed trip guide for...`
```

### Prompt Updates
1. Edit prompts in `src/lib/tripGuideGenerator.ts`
2. Deploy changes via git push
3. Test with `?TestMod=1` parameter

### OpenAI Configuration
- Model: `gpt-4-turbo-preview`
- Max tokens: 2000
- Temperature: 0.7
- Located in: `src/lib/openai.ts`

## 5. Operations Runbook

### Deployment Process
```bash
# Staging (Preview)
git push origin feature-branch  # Auto-deploys preview

# Production
git push origin main           # Auto-deploys to production
```

### Rollback Steps
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "Promote to Production"
4. Or revert git commit: `git revert HEAD && git push`

### Logs & Monitoring
- **Vercel Logs**: Dashboard → Functions → View logs
- **Client Logs**: Browser developer console
- **API Errors**: Check Vercel function logs for 500 errors

### Content Updates
1. Update Airtable experts database directly
2. Changes reflect immediately (no redeploy needed)
3. Test expert matching with `?TestMod=1`

## 6. Service Integrations & Accounts

### Services Used
- **GitHub**: Repository hosting
- **Vercel**: App hosting and deployment
- **OpenAI**: AI trip guide generation
- **GoHighLevel**: CRM lead capture
- **Airtable**: Expert database

### Account Ownership Transfer
All accounts should be transferred to `ali@outdoorable.co`:
- ✅ GitHub repository access
- ✅ Vercel project ownership  
- ✅ Airtable base ownership
- ✅ Domain management (if custom domain)

### Billing Considerations
- **Vercel**: Hobby plan sufficient for moderate traffic
- **OpenAI**: Pay-per-use (~$0.01 per trip guide)
- **Airtable**: Free plan supports 1,200 records
- **GoHighLevel**: Existing client account

## 7. Critical Files & Configuration

### Must-Know Files
1. **`next.config.js`** - Enables iframe embedding (CSP headers)
2. **`src/app/page.tsx`** - Main application entry and user flow
3. **`src/lib/tripGuideGenerator.ts`** - AI integration and prompts
4. **`src/lib/gohighlevel.ts`** - CRM lead saving
5. **`src/components/FlowSelector.tsx`** - User journey start

### Iframe Embedding
```html
<iframe 
  src="https://your-domain.vercel.app/?embedded=true" 
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>
```

### Test Mode Access
- URL: `https://your-domain.vercel.app/?TestMod=1`
- Provides testing interface for all flows
- No API calls to external services in test mode

## 8. Known Limitations & Notes

### Current Limitations
- Expert matching limited to Airtable record limits (1,200 free plan)
- AI generation takes 15-30 seconds per request
- Requires active internet connection for all features

### Performance Considerations
- Widget loads in ~2-3 seconds on fast connections
- Mobile responsive but optimized for desktop
- OpenAI API calls are rate limited (handle gracefully)

### Cost Monitoring
- **OpenAI**: ~$0.01 per trip guide generated
- **Expected monthly cost**: $10-50 for moderate traffic
- Monitor Vercel bandwidth usage

### Maintenance Best Practices
1. Monitor OpenAI API costs monthly
2. Update Airtable experts database regularly
3. Test widget embedding after any code changes
4. Keep dependencies updated quarterly

### Future Improvements
- Add analytics tracking
- Implement caching for expert matching
- Add more customizable prompts
- Support multiple languages

## 9. Support & Contact

### Handoff Support
- **Developer**: [developer-contact]
- **Support Window**: 2 weeks post-handoff
- **Response Time**: 24-48 hours for technical issues

### Emergency Contacts
- **Critical Issues**: Vercel status page, OpenAI status
- **Rollback Required**: Use Vercel dashboard or git revert
- **API Failures**: Check service status pages first

---

**Project Status**: Production Ready ✅  
**Last Updated**: [current-date]  
**Next Review**: 3 months post-handoff