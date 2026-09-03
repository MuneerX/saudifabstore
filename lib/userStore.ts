import bcrypt from 'bcryptjs';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db/connect';

export interface StoredUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  password: string; // bcrypt hashed password
  company?: string;
  referralSource?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

declare global {
  // eslint-disable-next-line no-var
  var inMemoryUserRegistry: Map<string, StoredUser> | undefined;
}

const memoryStore = global.inMemoryUserRegistry || new Map<string, StoredUser>();
if (!global.inMemoryUserRegistry) {
  global.inMemoryUserRegistry = memoryStore;

  // Seed default admin in memory store
  const defaultAdminPassword = bcrypt.hashSync('admin123', 10);
  memoryStore.set('admin@saudifabstore.com', {
    id: 'admin-static-id',
    name: 'Saudi Fab Admin',
    email: 'admin@saudifabstore.com',
    password: defaultAdminPassword,
    company: 'Saudi Fab Store',
    referralSource: 'Direct',
    role: 'admin',
    createdAt: new Date(),
  });
}

export async function findUserByEmail(identifier: string): Promise<StoredUser | null> {
  if (!identifier || !identifier.trim()) return null;
  const normalized = identifier.toLowerCase().trim();

  // 1. Check MongoDB Atlas first
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const dbUser = await User.findOne({
        $or: [{ email: normalized }, { phone: normalized }]
      });
      if (dbUser) {
        return {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email || '',
          phone: dbUser.phone || '',
          password: dbUser.password,
          company: dbUser.company,
          referralSource: dbUser.referralSource || 'Direct',
          role: dbUser.role as 'user' | 'admin',
          createdAt: dbUser.createdAt,
        };
      }
    }
  } catch (err) {
    console.warn('[UserStore] MongoDB query fallback to runtime memory:', (err as Error).message);
  }

  // 2. Fallback to runtime user registry
  const directMatch = memoryStore.get(normalized);
  if (directMatch) return directMatch;

  for (const user of memoryStore.values()) {
    if ((user.email && user.email.toLowerCase() === normalized) || (user.phone && user.phone.trim() === normalized)) {
      return user;
    }
  }

  return null;
}

export const findUserByEmailOrPhone = findUserByEmail;

export async function registerNewUser(userData: {
  name: string;
  email?: string;
  phone?: string;
  emailOrPhone?: string;
  password: string;
  company?: string;
  referralSource?: string;
  role?: 'user' | 'admin';
}): Promise<{ success: boolean; user?: StoredUser; error?: string }> {
  const rawInput = (userData.emailOrPhone || userData.email || userData.phone || '').trim();
  if (!rawInput) {
    return { success: false, error: 'Mobile number or email address is required.' };
  }

  const isEmail = rawInput.includes('@');
  const normalizedEmail = isEmail ? rawInput.toLowerCase() : (userData.email ? userData.email.toLowerCase().trim() : undefined);
  const normalizedPhone = !isEmail ? rawInput : (userData.phone ? userData.phone.trim() : undefined);

  // Check if user already exists in DB or memory store
  const existing = await findUserByEmail(rawInput);
  if (existing) {
    return { success: false, error: 'An account with this email address or mobile number already exists.' };
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser: StoredUser = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: userData.name.trim(),
    email: normalizedEmail,
    phone: normalizedPhone,
    password: hashedPassword,
    company: userData.company?.trim() || '',
    referralSource: userData.referralSource || 'Direct',
    role: userData.role || 'user',
    createdAt: new Date(),
  };

  // Record in memory store immediately to guarantee instant login capability
  memoryStore.set(rawInput.toLowerCase(), newUser);
  if (normalizedEmail) memoryStore.set(normalizedEmail, newUser);
  if (normalizedPhone) memoryStore.set(normalizedPhone, newUser);

  // Attempt to save to MongoDB Atlas database
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const dbUser = new User({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        password: newUser.password,
        company: newUser.company,
        referralSource: newUser.referralSource,
        role: newUser.role,
      });
      const saved = await dbUser.save();
      newUser.id = saved._id.toString();
      // Update memory store with actual MongoDB _id
      memoryStore.set(rawInput.toLowerCase(), newUser);
      if (normalizedEmail) memoryStore.set(normalizedEmail, newUser);
      if (normalizedPhone) memoryStore.set(normalizedPhone, newUser);
    }
  } catch (err) {
    console.warn('[UserStore] MongoDB save warning, registered in memory store:', (err as Error).message);
  }

  return { success: true, user: newUser };
}
