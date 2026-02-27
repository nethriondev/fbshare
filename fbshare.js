const axios = require('axios');
const readline = require('readline');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (q) => new Promise((r) => rl.question(q, r));

async function askWithValidation(q, field) {
  let val = '';
  while (!val) {
    val = await ask(q);
    if (!val) console.log(chalk.red(`⚠️ ${field} cannot be empty`));
  }
  return val;
}

async function readCookieFromFile() {
  try {
    let cookies = [], cookieSources = [];
    const files = await fs.readdir(__dirname);
    const cookieFiles = files.filter(file => file === 'cookie.json' || file === 'cookie.txt' || /^cookie\d+\.(json|txt)$/.test(file));
    
    for (const file of cookieFiles) {
      const content = await fs.readFile(path.join(__dirname, file), 'utf8');
      if (file.endsWith('.json')) {
        try {
          const jsonData = JSON.parse(content);
          cookies.push(jsonData);
          cookieSources.push({ file, cookie: jsonData });
          console.log(chalk.green(`✅ Loaded cookie from ${file}`));
        } catch (e) {
          console.log(chalk.red(`❌ Invalid JSON in ${file}`));
        }
      } else {
        const trimmed = content.trim();
        if (trimmed) {
          cookies.push(trimmed);
          cookieSources.push({ file, cookie: trimmed });
          console.log(chalk.green(`✅ Loaded cookie from ${file}`));
        }
      }
    }
    if (cookies.length === 0) throw new Error('No valid cookie files found');
    console.log(chalk.yellow(`📊 Total cookie files loaded: ${cookies.length}`));
    return { cookies, cookieSources };
  } catch (error) {
    console.log(chalk.red(`❌ Failed to read cookie files: ${error.message}`));
    return null;
  }
}

async function deleteDeadCookie(file) {
  try {
    await fs.unlink(path.join(__dirname, file));
    console.log(chalk.red(`🗑️ Deleted file: ${file}`));
    return true;
  } catch (error) {
    console.log(chalk.red(`❌ Failed to delete ${file}`));
    return false;
  }
}

async function shareWithCookie(url, cookie, amount, interval, threads, file) {
  try {
    const response = await axios.post('https://oreo.gleeze.com/api/fbshare', {
      postUrl: url, cookie, shareAmount: parseInt(amount),
      intervalSeconds: parseInt(interval), threads: parseInt(threads), stream: true
    }, {
      responseType: 'stream',
      headers: { 'Accept': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Content-Type': 'application/json' }
    });

    response.data.setEncoding('utf8');
    let buffer = '';

    return new Promise((resolve) => {
      response.data.on('data', (chunk) => {
        buffer += chunk;
        const messages = buffer.split('\n\n');
        buffer = messages.pop();
        
        for (const message of messages) {
          const lines = message.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.status === 'started') console.log(chalk.cyan(`[${file}] 🚀 ${data.message}`));
                else if (data.status === 'progress') process.stdout.write(`\r[${file}] ${chalk.cyan(`📊 ${data.message}`)}`);
                else if (data.status === 'completed') {
                  console.log(chalk.green(`\n[${file}] ✅ ${data.message}`));
                  resolve({ success: true, file });
                } else if (data.status === 'error' || data.status === 'partial_error') {
                  console.log(chalk.red(`\n[${file}] ❌ ${data.error}`));
                  resolve({ success: false, file, error: data.error });
                } else if (data.status === 'expired') {
                  console.log(chalk.red(`\n[${file}] ❌ ${data.error}`));
                  resolve({ success: false, file, error: data.error, expired: true });
                }
              } catch (e) {}
            }
          }
        }
      });

      response.data.on('end', () => resolve({ success: true, file }));
      response.data.on('error', (err) => {
        console.log(chalk.red(`\n[${file}] ❌ ${err.message}`));
        resolve({ success: false, file, error: err.message });
      });
    });

  } catch (err) {
    let errorMessage = err.message;
    if (err.response?.data) {
      if (Buffer.isBuffer(err.response.data)) errorMessage = err.response.data.toString();
      else if (typeof err.response.data === 'object') errorMessage = err.response.data.error || errorMessage;
      else if (typeof err.response.data === 'string') errorMessage = err.response.data;
    }
    console.log(chalk.red(`\n[${file}] ❌ ${errorMessage}`));
    return { success: false, file, error: errorMessage, statusCode: err.response?.status };
  }
}

async function main() {
  console.clear();
  console.log(chalk.red('┌─────────────────────────────────┐'));
  console.log(chalk.cyan('│') + chalk.bold.yellow('          FB SHARE BOOSTER       ') + chalk.cyan('│'));
  console.log(chalk.red('└─────────────────────────────────┘\n'));
  console.log(chalk.yellow('📱 TROUBLESHOOTING: If shares don\'t work, try using Facebook Lite app and tap 3 dots of the post then copy the link to avoid any issues\n'));
  
  const url = await askWithValidation(chalk.yellow('📎 POST URL: '), 'Post URL');
  const cookieData = await readCookieFromFile();
  if (!cookieData) {
    console.log(chalk.red('\n❌ Cannot proceed without cookie files'));
    rl.close(); return;
  }
  
  const { cookies, cookieSources } = cookieData;
  const amount = await ask(chalk.yellow('📊 AMOUNT PER COOKIE ') + chalk.gray('[1000]: ')) || '1000';
  const interval = await ask(chalk.yellow('⏱️ INTERVAL ') + chalk.gray('[0]: ')) || '0';
  const threads = await ask(chalk.yellow('🧵 THREADS ') + chalk.gray('[1]: ')) || '1';

  console.log(chalk.cyan('\n⏳ BOOSTING WITH ' + cookies.length + ' COOKIES...\n'));

  const results = [];
  for (let i = 0; i < cookies.length; i++) {
    const source = cookieSources[i];
    console.log(chalk.yellow(`\n--- Processing ${source.file} (${i+1}/${cookies.length}) ---`));
    results.push(await shareWithCookie(url, source.cookie, amount, interval, threads, source.file));
  }

  const expiredCookies = results.filter(r => r.expired);
  if (expiredCookies.length > 0) {
    console.log(chalk.yellow('\n🔍 EXPIRED COOKIES DETECTED:'));
    for (const expired of expiredCookies) {
      if ((await ask(chalk.yellow(`\n❓ ${expired.file} expired. Delete it? (y/n): `))).toLowerCase() === 'y') {
        await deleteDeadCookie(expired.file);
      }
    }
  }

  console.log(chalk.cyan('\n📊 FINAL RESULTS:'));
  console.log(chalk.green(`✅ Successful: ${results.filter(r => r.success).length}`));
  console.log(chalk.red(`❌ Failed: ${results.filter(r => !r.success && !r.expired).length}`));
  if (expiredCookies.length > 0) console.log(chalk.yellow(`⌛ Expired: ${expiredCookies.length}`));
  
  rl.close();
}

process.on('exit', () => rl.close());
main().catch(console.error);