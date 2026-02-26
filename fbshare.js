const axios = require('axios');
const readline = require('readline');
const chalk = require('chalk');
const fs = require('fs').promises;
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(q) {
  return new Promise((r) => rl.question(q, r));
}

async function askWithValidation(q, field) {
  let val = '';
  while (!val) {
    val = await ask(q);
    if (!val) console.log(chalk.hex('#FF6B6B')(`⚠️  ${field} cannot be empty`));
  }
  return val;
}

async function readCookieFromFile() {
  try {
    let cookies = [];
    let cookieSources = [];
    const files = await fs.readdir(__dirname);
    
    const cookieFiles = files.filter(file => 
      (file === 'cookie.json' || file === 'cookie.txt' || /^cookie\d+\.(json|txt)$/.test(file))
    );
    
    for (const file of cookieFiles) {
      const filePath = path.join(__dirname, file);
      const content = await fs.readFile(filePath, 'utf8');
      
      if (file.endsWith('.json')) {
        try {
          const jsonData = JSON.parse(content);
          cookies.push(jsonData);
          cookieSources.push({ file, cookie: jsonData });
          console.log(chalk.hex('#4ECDC4')(`✅ Loaded cookie from ${file}`));
        } catch (e) {
          console.log(chalk.hex('#FF6B6B')(`❌ Invalid JSON in ${file}`));
        }
      } else {
        const trimmed = content.trim();
        if (trimmed) {
          cookies.push(trimmed);
          cookieSources.push({ file, cookie: trimmed });
          console.log(chalk.hex('#4ECDC4')(`✅ Loaded cookie from ${file}`));
        }
      }
    }
    
    if (cookies.length === 0) {
      throw new Error('No valid cookie files found');
    }
    
    console.log(chalk.hex('#FFE66D')(`📊 Total cookie files loaded: ${cookies.length}`));
    return { cookies, cookieSources };
    
  } catch (error) {
    console.log(chalk.hex('#FF6B6B')(`❌ Failed to read cookie files: ${error.message}`));
    return null;
  }
}

async function deleteDeadCookie(file) {
  try {
    const filePath = path.join(__dirname, file);
    await fs.unlink(filePath);
    console.log(chalk.hex('#FF6B6B')(`🗑️  Deleted file: ${file}`));
    return true;
  } catch (error) {
    console.log(chalk.hex('#FF6B6B')(`❌ Failed to delete ${file}: ${error.message}`));
    return false;
  }
}

async function shareWithCookie(url, cookie, amount, interval, threads, file) {
  try {
    const response = await axios.post('https://oreo.gleeze.com/api/fbshare', {
      postUrl: url,
      cookie: cookie,
      shareAmount: parseInt(amount),
      intervalSeconds: parseInt(interval),
      threads: parseInt(threads),
      stream: true
    }, {
      responseType: 'stream',
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
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
                
                if (data.status === 'started') {
                  console.log(chalk.hex('#4ECDC4')(`[${file}] 🚀 ${data.message}`));
                } else if (data.status === 'progress') {
                  process.stdout.write(`\r[${file}] ${chalk.hex('#4ECDC4')(`📊 ${data.message}`)}`);
                } else if (data.status === 'completed') {
                  console.log(chalk.hex('#2ECC71')(`\n[${file}] ✅ COMPLETE: ${data.shareCount} shares`));
                  resolve({ success: true, file });
                } else if (data.status === 'error') {
                  console.log(chalk.hex('#FF6B6B')(`\n[${file}] ❌ ERROR: ${data.error}`));
                  resolve({ success: false, file, error: data.error });
                }
              } catch (e) {
              }
            }
          }
        }
      });

      response.data.on('end', () => {
        resolve({ success: true, file });
      });

      response.data.on('error', (err) => {
        console.log(chalk.hex('#FF6B6B')(`\n[${file}] ❌ Stream Error: ${err.message}`));
        resolve({ success: false, file, error: err.message });
      });
    });

  } catch (err) {
    console.log(chalk.hex('#FF6B6B')(`\n[${file}] ❌ FAILED: ${err.message}`));
    return { success: false, file, error: err.message };
  }
}

async function main() {
  console.clear();
  console.log(chalk.hex('#FF6B6B')('┌─────────────────────────────────┐'));
  console.log(chalk.hex('#4ECDC4')('│') + chalk.bold.hex('#FFE66D')('          FB SHARE BOOSTER       ') + chalk.hex('#4ECDC4')('│'));
  console.log(chalk.hex('#FF6B6B')('└─────────────────────────────────┘\n'));
  
  console.log(chalk.hex('#FFE66D')('📱 TROUBLESHOOTING: If shares don\'t work, try using Facebook Lite app and tap 3 dots of the post then copy the link to avoid any issues\n'));
  
  const url = await askWithValidation(chalk.hex('#FFE66D')('📎 POST URL: '), 'Post URL');
  const cookieData = await readCookieFromFile();
  if (!cookieData) {
    console.log(chalk.hex('#FF6B6B')('\n❌ Cannot proceed without cookie files'));
    rl.close();
    return;
  }
  
  const { cookies, cookieSources } = cookieData;
  
  const amount = await ask(chalk.hex('#FFE66D')('📊 AMOUNT PER COOKIE ') + chalk.gray('[1000]: ')) || '1000';
  const interval = await ask(chalk.hex('#FFE66D')('⏱️  INTERVAL ') + chalk.gray('[0]: ')) || '0';
  const threads = await ask(chalk.hex('#FFE66D')('🧵 THREADS ') + chalk.gray('[1]: ')) || '1';

  console.log(chalk.hex('#4ECDC4')('\n⏳ BOOSTING WITH ' + cookies.length + ' COOKIES...\n'));

  const results = [];
  for (let i = 0; i < cookies.length; i++) {
    const source = cookieSources[i];
    console.log(chalk.hex('#FFE66D')(`\n--- Processing ${source.file} (${i+1}/${cookies.length}) ---`));
    
    const result = await shareWithCookie(url, source.cookie, amount, interval, threads, source.file);
    results.push(result);
    
    if (!result.success) {
      const answer = await ask(chalk.hex('#FFE66D')(`\n❓ ${source.file} failed. Delete it? (y/n): `));
      if (answer.toLowerCase() === 'y') {
        await deleteDeadCookie(source.file);
      }
      console.log(chalk.hex('#FF6B6B')("Ctrl + C to Exit!"));
    }
  }

  console.log(chalk.hex('#4ECDC4')('\n📊 FINAL RESULTS:'));
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(chalk.hex('#2ECC71')(`✅ Successful: ${successful}`));
  console.log(chalk.hex('#FF6B6B')(`❌ Failed: ${failed}`));
  
  rl.close();
}

main();