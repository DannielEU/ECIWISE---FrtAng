import { chromium } from 'playwright';

const token = process.env.ADMIN_JWT;
const adminId = process.env.ADMIN_ID;
const session = {
  id: adminId,
  name: 'Admin ECIWISE',
  email: 'admin@eciwise.edu.co',
  role: 'ADMIN',
  active: true,
  mustChangePassword: false,
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1400 } });
await ctx.addInitScript(([t, s]) => {
  localStorage.setItem('eciwise.token', t);
  localStorage.setItem('eciwise.session', s);
}, [token, JSON.stringify(session)]);

const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('response', (r) => {
  if (r.url().includes('/ia/estadisticas')) console.log('API', r.status(), r.url());
});

await page.goto('http://localhost:4200/admin/estadisticas', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500);
console.log('URL:', page.url());
const txt = await page.locator('body').innerText();
console.log('--- visible headings ---');
console.log(txt.split('\n').filter(l => l.trim()).slice(0, 40).join('\n'));
const charts = await page.locator('eci-pie-chart, eci-histogram').count();
const svgs = await page.locator('eci-pie-chart svg circle').count();
const bars = await page.locator('eci-histogram .hist__bar').count();
console.log('chart components:', charts, '| pie arcs:', svgs, '| histogram bars:', bars);
if (errors.length) console.log('CONSOLE ERRORS:', errors.slice(0, 5).join(' | '));
await page.screenshot({ path: '/tmp/estadisticas.png', fullPage: true });
console.log('screenshot saved');
await browser.close();
