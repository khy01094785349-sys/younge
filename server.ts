import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Data storage path
const DATA_DIR = path.resolve(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default settings
const DEFAULT_SETTINGS = {
  bankName: '농협은행',
  accountNumber: '352-0109-4785-33',
  accountHolder: '바른생식 (김혜영)',
  shopName: '바른생식',
  contactPhone: '010-9478-5349',
};

if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
}

// Initial seeded user (e.g. store owner / customer 김혜영)
if (!fs.existsSync(USERS_FILE)) {
  const initialUsers = [
    {
      id: 'user_khy',
      email: 'khy01094785349@gmail.com',
      password: 'password123',
      name: '김혜영',
      phone: '01094785349',
      address: '충북 충주시 행정13길20',
      detailAddress: '101호',
      createdAt: new Date().toISOString(),
    },
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
}

// Seed initial order matching user's test order if empty
if (!fs.existsSync(ORDERS_FILE)) {
  const initialOrders = [
    {
      id: 'ORD-20261007-1011',
      createdAt: new Date().toISOString(),
      customerName: '김혜영',
      phone: '01094785349',
      address: '충북 충주시 행정13길20',
      detailAddress: '101호',
      deliveryNote: '문 앞에 놓아주세요',
      paymentMethod: 'bank',
      productName: '자연을 담은 순수생식 50',
      optionName: '1박스 (30포 / 1개월분)',
      boxCount: 1,
      pouchCount: 30,
      quantity: 1,
      unitPrice: 38000,
      totalPrice: 38000,
      status: '입금대기',
      courier: 'CJ대한통운',
      trackingNumber: '',
    },
  ];
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(initialOrders, null, 2), 'utf-8');
}

function getOrders(): any[] {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveOrders(orders: any[]) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
}

function getUsers(): any[] {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function getSettings(): any {
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: any) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
}

// ---------------- Auth API Routes ----------------

// REGISTER
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, name, phone = '', address = '', detailAddress = '' } = req.body;

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 주소(예: name@example.com)를 입력해 주세요.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Validate name
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: '성함(이름)을 입력해 주세요.',
      });
    }

    // Validate password (at least 6 characters)
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: '비밀번호를 입력해 주세요.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: `비밀번호는 최소 6자 이상이어야 합니다. (현재 ${password.length}자)`,
      });
    }

    const users = getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: '이미 가입되어 있는 이메일 주소입니다. 로그인해 주세요.',
      });
    }

    const newUser = {
      id: `user_${Date.now()}`,
      email: cleanEmail,
      password,
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      detailAddress: detailAddress.trim(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const safeUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      address: newUser.address,
      detailAddress: newUser.detailAddress,
    };

    res.status(201).json({
      success: true,
      message: `${safeUser.name} 님, 회원가입이 완료되었습니다!`,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: '회원가입 처리 중 오류가 발생했습니다.' });
  }
});

// LOGIN
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: '올바른 이메일 형식으로 입력해 주세요.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: '비밀번호를 입력해 주세요.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: `비밀번호는 최소 6자 이상이어야 합니다. (현재 ${password.length}자)`,
      });
    }

    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: '가입되지 않은 이메일 주소입니다. 먼저 회원가입을 진행해 주세요.',
      });
    }

    if (user.password !== password) {
      return res.status(400).json({
        success: false,
        message: '비밀번호가 올바르지 않습니다. 다시 확인해 주세요.',
      });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address || '',
      detailAddress: user.detailAddress || '',
    };

    res.json({
      success: true,
      message: `${safeUser.name} 님, 로그인되었습니다!`,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: '로그인 처리 중 오류가 발생했습니다.' });
  }
});

// ---------------- API Routes ----------------

// GET settings (bank account info etc.)
app.get('/api/settings', (req, res) => {
  res.json(getSettings());
});

// UPDATE settings
app.put('/api/settings', (req, res) => {
  const updated = { ...getSettings(), ...req.body };
  saveSettings(updated);
  res.json({ success: true, settings: updated });
});

// GET all orders (for admin)
app.get('/api/orders', (req, res) => {
  const orders = getOrders();
  res.json({ success: true, orders });
});

// LOOKUP order by phone or orderId (for customers)
app.get('/api/orders/lookup', (req, res) => {
  const { query } = req.query;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ success: false, message: '검색어를 입력해주세요.' });
  }

  const cleanQuery = query.replace(/[^0-9a-zA-Z가-힣]/g, '');
  const orders = getOrders();

  const matched = orders.filter((o) => {
    const cleanPhone = (o.phone || '').replace(/[^0-9]/g, '');
    const cleanId = (o.id || '').replace(/[^0-9a-zA-Z]/g, '');
    const cleanName = (o.customerName || '');
    return (
      cleanPhone.includes(cleanQuery) ||
      cleanId.toLowerCase().includes(cleanQuery.toLowerCase()) ||
      cleanName.includes(cleanQuery)
    );
  });

  res.json({ success: true, orders: matched });
});

// CREATE a new order (from customer)
app.post('/api/orders', (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      detailAddress = '',
      deliveryNote = '문 앞에 놓아주세요',
      paymentMethod = 'bank',
      productName = '자연을 담은 순수생식 50',
      optionName = '1박스 (30포 / 1개월분)',
      boxCount = 1,
      pouchCount = 30,
      quantity = 1,
      unitPrice = 38000,
      totalPrice = 38000,
    } = req.body;

    if (!customerName || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: '성함, 연락처, 주소는 필수 입력 사항입니다.',
      });
    }

    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `ORD-${todayStr}-${randomSuffix}`;

    const newOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      detailAddress: detailAddress.trim(),
      deliveryNote: deliveryNote.trim(),
      paymentMethod,
      productName,
      optionName,
      boxCount,
      pouchCount,
      quantity: Number(quantity) || 1,
      unitPrice: Number(unitPrice) || 38000,
      totalPrice: Number(totalPrice) || 38000,
      status: paymentMethod === 'bank' ? '입금대기' : '결제완료',
      courier: 'CJ대한통운',
      trackingNumber: '',
    };

    const orders = getOrders();
    // Add to top of list
    orders.unshift(newOrder);
    saveOrders(orders);

    console.log(`[새 주문 접수] ${newOrderId} - ${customerName} (${totalPrice.toLocaleString()}원)`);

    res.status(201).json({
      success: true,
      message: '주문이 성공적으로 접수되었습니다.',
      order: newOrder,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: '주문 저장 중 오류가 발생했습니다.' });
  }
});

// UPDATE order status / tracking info
app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, courier, trackingNumber } = req.body;

  const orders = getOrders();
  const orderIdx = orders.findIndex((o) => o.id === id);

  if (orderIdx === -1) {
    return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
  }

  if (status) orders[orderIdx].status = status;
  if (courier !== undefined) orders[orderIdx].courier = courier;
  if (trackingNumber !== undefined) orders[orderIdx].trackingNumber = trackingNumber;

  saveOrders(orders);

  res.json({
    success: true,
    message: '주문 정보가 업데이트되었습니다.',
    order: orders[orderIdx],
  });
});

// DELETE an order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const orders = getOrders();
  const filtered = orders.filter((o) => o.id !== id);

  if (filtered.length === orders.length) {
    return res.status(404).json({ success: false, message: '주문을 찾을 수 없습니다.' });
  }

  saveOrders(filtered);
  res.json({ success: true, message: '주문이 삭제되었습니다.' });
});

// ---------------- Vite / Static middleware ----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
