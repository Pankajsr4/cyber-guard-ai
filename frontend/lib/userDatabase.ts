// Simple user database using localStorage
// In production, this would be a real backend database

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
}

const USERS_KEY = 'cyberguard_users';
const ADMIN_EMAIL = 'kumarpankaj9982@gmail.com';
const ADMIN_PASSWORD = 'Pankaj@2003';

// Initialize with admin user
const initializeDatabase = () => {
  const users = getUsers();
  
  // Check if admin exists
  const adminExists = users.some(u => u.email === ADMIN_EMAIL);
  
  if (!adminExists) {
    const adminUser: User = {
      id: 'admin-001',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: 'Pankaj Kumar',
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    users.push(adminUser);
    saveUsers(users);
  }
};

// Get all users from localStorage
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  
  const usersJson = localStorage.getItem(USERS_KEY);
  if (!usersJson) {
    return [];
  }
  
  try {
    return JSON.parse(usersJson);
  } catch (e) {
    return [];
  }
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Check if user exists
export const userExists = (email: string): boolean => {
  const users = getUsers();
  return users.some(u => u.email.toLowerCase() === email.toLowerCase());
};

// Get user by email
export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

// Register new user
export const registerUser = (email: string, password: string, name: string): { success: boolean; message: string; user?: User } => {
  initializeDatabase();
  
  // Check if user already exists
  if (userExists(email)) {
    return {
      success: false,
      message: 'User with this email already exists. Please login instead.'
    };
  }
  
  // Create new user
  const newUser: User = {
    id: 'user-' + Date.now(),
    email: email.toLowerCase(),
    password: password,
    name: name,
    role: 'user',
    createdAt: new Date().toISOString()
  };
  
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
  
  return {
    success: true,
    message: 'Account created successfully!',
    user: newUser
  };
};

// Authenticate user
export const authenticateUser = (email: string, password: string): { success: boolean; message: string; user?: User } => {
  initializeDatabase();
  
  const user = getUserByEmail(email);
  
  if (!user) {
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }
  
  // Check password
  if (user.password !== password) {
    return {
      success: false,
      message: 'Invalid email or password'
    };
  }
  
  return {
    success: true,
    message: 'Login successful!',
    user: user
  };
};

// Get all registered users (admin only)
export const getAllUsers = (): User[] => {
  initializeDatabase();
  return getUsers();
};

// Initialize database on import
if (typeof window !== 'undefined') {
  initializeDatabase();
}
