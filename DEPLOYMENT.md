# 🚀 Deployment Guide

## GitHub Repository Setup

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `alfie-chat-widget`  
3. Description: `🦊 Alfie Chat Widget - AI Travel Concierge MVP with N8N Integration`
4. Set to **Public**
5. **DON'T** initialize with README (we already have files)
6. Click **Create repository**

## Push to GitHub

```bash
cd C:\Users\79818\Desktop\Outdoorable
git remote add origin https://github.com/LeonidSvb/alfie-chat-widget.git
git branch -M main
git push -u origin main
```

## GitHub Pages Setup

1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** / **root**
4. Click **Save**

## Webflow Integration

After GitHub Pages is live, use this embed code:

```html
<div id="alfie-widget-container"></div>
<script src="https://leonidsvb.github.io/alfie-chat-widget/index.html"></script>
```

## Live Demo

Once deployed, the widget will be available at:
`https://leonidsvb.github.io/alfie-chat-widget/`

## N8N Webhooks

The widget is configured to use these endpoints:
- Intermediate: `https://leonidshvorob.app.n8n.cloud/webhook/alfie-summary`
- Final: `https://leonidshvorob.app.n8n.cloud/webhook/alfie-final`

Make sure your N8N workflows are active and these URLs are accessible.