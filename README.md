You're right! Let me update the documentation to clarify the web version only supports single cookie:

# Facebook Share Booster 🚀

![Version](https://img.shields.io/badge/version-2.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D12.0.0-green)
![License](https://img.shields.io/badge/license-MIT-orange)

A powerful Facebook post share booster available in two versions:
- **CLI Version** - Multiple cookies, auto dead cookie deletion
- **Web Version** - Single cookie, direct API, no server needed

## 📸 Screenshots

![Demo](https://raw.githubusercontent.com/nethriondev/fbshare/main/screenshots/demo.jpg)

![Web](https://raw.githubusercontent.com/nethriondev/fbshare/main/screenshots/web.jpg)

![Proof](https://raw.githubusercontent.com/nethriondev/fbshare/main/screenshots/proof.jpg)

## ✨ Features

### CLI Version
- 🔥 Process multiple cookies sequentially
- 📁 Support for JSON and TXT cookie files
- 🗑️ Auto dead cookie detection & deletion
- 📊 Final summary of all cookies

### Web Version
- 🌐 Single cookie interface
- ⚡ Direct API connection
- 🚀 No server required
- 📱 Mobile responsive design
- 🎨 Modern UI with live logs

## 🚀 Quick Start

### CLI Version (Multiple Cookies)
```bash
git clone https://github.com/nethriondev/fbshare.git
cd fbshare
node fbshare.js
```

### Web Version (Single Cookie)
Just deploy `index.html` to any static hosting:
- Vercel (one click)
- Netlify (drag & drop)
- GitHub Pages
- Any web server

## 📁 Cookie Setup

### For CLI Version (Multiple Cookies)
Create any of these files in the same directory:

| File Format | Example | Description |
|------------|---------|-------------|
| `cookie.json` | Netscape format array | Multiple cookies in one file |
| `cookie.txt` | `c_user=123; xs=456;` | Single cookie string |
| `cookie1.json` | `cookie2.json` | Multiple numbered files |

### For Web Version (Single Cookie)
- Just paste your cookie in the textarea
- No files needed

## 💻 CLI Usage

1. **Run the booster**
```bash
node fbshare.js
```

2. **Enter post URL**
```
📎 POST URL: https://facebook.com/post/123
```

3. **Configure settings** (Enter for defaults)
```
📊 AMOUNT PER COOKIE [1000]: 500
⏱️  INTERVAL [0]: 2
🧵 THREADS [1]: 3
```

## 🌐 Web Version

**Single Cookie Interface**
- Paste one cookie at a time
- Live progress tracking
- Real-time stats
- Mobile friendly

Access via: `https://your-domain.com`

## ⚙️ Configuration

| Option | CLI Version | Web Version |
|--------|------------|-------------|
| Multiple Cookies | ✅ Yes | ❌ No |
| Auto Delete Dead | ✅ Yes | ❌ No |
| Live Logs | ✅ Yes | ✅ Yes |
| Stats Tracking | ✅ Yes | ✅ Yes |
| No Server | ❌ No | ✅ Yes |

## 🔧 Troubleshooting

**No cookie files found (CLI)**
- Create `cookie.json` or `cookie.txt` in project folder

**Shares not working (Both)**
- Use Facebook Lite app
- Tap 3 dots → copy link
- Use fresh cookies
- Test with 100 shares first

**Web version not connecting**
- Check internet connection
- API endpoint: `https://oreo.gleeze.com/api/fbshare`
- CORS is enabled

## 📝 License

MIT © 2026 Kenneth Panio

---

**⭐ Star on GitHub**