# Facebook Share Booster 🚀

![Version](https://img.shields.io/badge/version-2.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D12.0.0-green)
![License](https://img.shields.io/badge/license-MIT-orange)

A powerful Facebook post share booster that processes multiple cookies **one by one** with real-time progress tracking and automatic dead cookie detection & removal.

## 📸 Screenshots

![Demo](https://raw.githubusercontent.com/nethriondev/fbshare/main/screenshots/demo.jpg)

![Proof](https://raw.githubusercontent.com/nethriondev/fbshare/main/screenshots/proof.jpg) 

## ✨ Features

- 🔥 **Process cookies sequentially** - Handles multiple cookies one at a time
- 📁 **Flexible file formats** - Support for JSON (including Netscape format) and TXT files
- 🚦 **Real-time progress** - Live updates showing which cookie is being processed
- 🗑️ **Auto dead cookie detection** - Identifies and offers to delete invalid cookies
- ⚡ **Adjustable settings** - Configure share amount, interval, and threads per cookie
- 🎨 **Beautiful CLI** - Color-coded output showing progress per cookie file
- 📊 **Final summary** - Shows total successful vs failed cookies

## 📋 Supported Cookie File Formats

| Format | Example | Description |
|--------|---------|-------------|
| JSON (Netscape) | `cookie.json` | `[{ "key": "c_user", "value": "123" }, ...]` |
| JSON (String) | `cookie.json` | `"sb=value; c_user=123; xs=456;"` |
| Text File | `cookie.txt` | Plain cookie string |
| Numbered JSON | `cookie1.json`, `cookie2.json` | Separate files |
| Numbered Text | `cookie1.txt`, `cookie2.txt` | Separate files |

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/nethriondev/fbshare.git
cd fbshare
```

2. **Install dependencies**
```bash
npm install axios readline chalk
```

3. **Add your cookies**
Create cookie files in the same directory. Each file represents **ONE** cookie session:
- `cookie.json` - Netscape format array or string
- `cookie.txt` - Plain text cookie string
- `cookie1.json`, `cookie2.json` - Multiple cookie files

## 💻 Usage

1. **Run the booster**
```bash
node fbshare.js
```

2. **Enter the post URL**
```
📎 POST URL: https://www.facebook.com/username/posts/123456789
```

3. **Configure settings** (or press Enter for defaults)
```
📊 AMOUNT PER COOKIE [1000]: 500
⏱️  INTERVAL [0]: 2
🧵 THREADS [1]: 3
```

4. **Watch the magic happen!** 🎩
```
⏳ BOOSTING WITH 3 COOKIES...

--- Processing cookie1.json (1/3) ---
[cookie1.json] 🚀 Share booster started
[cookie1.json] 📊 Progress: 45/500 shares completed
[cookie1.json] ✅ COMPLETE: 500 shares

--- Processing cookie2.json (2/3) ---
[cookie2.json] 🚀 Share booster started
[cookie2.json] 📊 Progress: 120/500 shares completed
[cookie2.json] ✅ COMPLETE: 500 shares
```

5. **Handle dead cookies** (if any)
```
[cookie3.json] ❌ ERROR: Invalid cookie
❓ cookie3.json failed. Delete it? (y/n): y
🗑️  Deleted file: cookie3.json

📊 FINAL RESULTS:
✅ Successful: 2
❌ Failed: 1
```

## ⚙️ Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `AMOUNT PER COOKIE` | 1000 | Number of shares per cookie |
| `INTERVAL` | 0 | Seconds between share attempts |
| `THREADS` | 1 | Number of concurrent threads per cookie |

## 📁 Cookie File Examples

### cookie.json (Netscape Format - Recommended)
```json
[
  { "key": "c_user", "value": "61587151630579", "domain": "facebook.com" },
  { "key": "xs", "value": "26%3AoxQ216UHL0XMhw%3A2", "domain": "facebook.com" },
  { "key": "fr", "value": "26UqYQUbp4cIPuWp6.AWf0z6bj33gGcDeoZIsH67s", "domain": "facebook.com" },
  { "key": "sb", "value": "u16YaV7-CoHF8hHV_unAfIgY", "domain": "facebook.com" }
]
```

### cookie.json (String Format)
```json
"sb=u16YaV7-CoHF8hHV_unAfIgY; c_user=61587151630579; xs=26%3AoxQ216UHL0XMhw%3A2; fr=26UqYQUbp4cIPuWp6.AWf0z6bj33gGcDeoZIsH67s"
```

### cookie.txt
```
sb=u16YaV7-CoHF8hHV_unAfIgY; c_user=61587151630579; xs=26%3AoxQ216UHL0XMhw%3A2; fr=26UqYQUbp4cIPuWp6.AWf0z6bj33gGcDeoZIsH67s
```

### Multiple Files Setup
```
📁 your-folder/
   ├── fbshare.js
   ├── cookie1.json  (Account 1 - Netscape format)
   ├── cookie2.json  (Account 2 - Netscape format)
   ├── cookie3.txt   (Account 3 - String format)
   └── cookie4.json  (Account 4 - Netscape format)
```

## 🔄 How It Works

1. **Scans** for all cookie files in the directory
2. **Processes** each cookie file **sequentially** (one after another)
3. **Shows real-time progress** for the current cookie being processed
4. **Detects failures** and asks if you want to delete dead cookies
5. **Provides final summary** of successful and failed cookies

## 🛠️ Troubleshooting

### "No valid cookie files found"
- Ensure at least one cookie file exists in the same directory
- Check file permissions
- Verify JSON format is valid

### Shares not working
- Use Facebook Lite app to get the post link
- Tap the 3 dots of the post and copy link
- Make sure cookies are valid and not expired
- Try reducing thread count or interval

### Invalid cookie format error
- For Netscape format, ensure it's an array of objects with `key` and `value`
- For string format, ensure it's a valid cookie string (key=value; pairs)

## ⚠️ Disclaimer

This tool is for educational purposes only. Use at your own risk. The developers are not responsible for any misuse or violations of Facebook's terms of service.

## 📝 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

GitHub: [@nethriondev](https://github.com/nethriondev)

Project Link: [https://github.com/nethriondev/fbshare](https://github.com/nethriondev/fbshare)

---

**⭐ Star this repo if you find it useful!**