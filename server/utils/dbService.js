import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Component from '../models/Component.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const COMPONENTS_FILE = path.join(DATA_DIR, 'components.json');

// Ensure data directory and files exist for fallback mode
const ensureFiles = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf8');
  }
  if (!fs.existsSync(COMPONENTS_FILE)) {
    fs.writeFileSync(COMPONENTS_FILE, JSON.stringify([]), 'utf8');
  }
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

// --- USER OPERATIONS ---

export const findUserByEmail = async (email, includePassword = false) => {
  if (isMongoConnected()) {
    const query = User.findOne({ email: email.toLowerCase().trim() });
    if (includePassword) query.select('+password');
    return await query.exec();
  } else {
    ensureFiles();
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find((u) => u.email === email.toLowerCase().trim());
    if (!user) return null;
    if (!includePassword) {
      const { password, ...userWithoutPass } = user;
      return userWithoutPass;
    }
    return user;
  }
};

export const findUserById = async (id) => {
  if (isMongoConnected()) {
    return await User.findById(id).select('-password');
  } else {
    ensureFiles();
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    const user = users.find((u) => u._id === id || u.id === id);
    if (!user) return null;
    const { password, ...userWithoutPass } = user;
    return userWithoutPass;
  }
};

export const createUser = async ({ name, email, password }) => {
  if (isMongoConnected()) {
    return await User.create({ name, email, password });
  } else {
    ensureFiles();
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    
    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');

    const { password: _, ...userWithoutPass } = newUser;
    return userWithoutPass;
  }
};

export const verifyPassword = async (enteredPassword, storedPassword) => {
  return await bcrypt.compare(enteredPassword, storedPassword);
};

// --- COMPONENT OPERATIONS ---

export const getComponentsByUser = async (userId) => {
  if (isMongoConnected()) {
    return await Component.find({ user: userId }).sort({ createdAt: -1 });
  } else {
    ensureFiles();
    const components = JSON.parse(fs.readFileSync(COMPONENTS_FILE, 'utf8'));
    return components
      .filter((c) => c.user === userId || c.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

export const getComponentById = async (id) => {
  if (isMongoConnected()) {
    return await Component.findById(id);
  } else {
    ensureFiles();
    const components = JSON.parse(fs.readFileSync(COMPONENTS_FILE, 'utf8'));
    return components.find((c) => c._id === id || c.id === id) || null;
  }
};

export const createComponent = async ({ user, title, prompt, framework, code, refinements }) => {
  if (isMongoConnected()) {
    return await Component.create({ user, title, prompt, framework, code, refinements });
  } else {
    ensureFiles();
    const components = JSON.parse(fs.readFileSync(COMPONENTS_FILE, 'utf8'));

    const newComp = {
      _id: 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      user: user.toString(),
      title: title || (prompt ? prompt.slice(0, 30) + '...' : 'Untitled Component'),
      prompt,
      framework: framework || 'html-css',
      code,
      refinements: refinements || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    components.unshift(newComp); // Add to top of list
    fs.writeFileSync(COMPONENTS_FILE, JSON.stringify(components, null, 2), 'utf8');
    return newComp;
  }
};

export const updateComponent = async (id, userId, updateData) => {
  if (isMongoConnected()) {
    return await Component.findOneAndUpdate({ _id: id, user: userId }, updateData, { new: true });
  } else {
    ensureFiles();
    const components = JSON.parse(fs.readFileSync(COMPONENTS_FILE, 'utf8'));
    const idx = components.findIndex((c) => (c._id === id || c.id === id) && (c.user === userId || c.userId === userId));
    if (idx === -1) return null;

    components[idx] = {
      ...components[idx],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    fs.writeFileSync(COMPONENTS_FILE, JSON.stringify(components, null, 2), 'utf8');
    return components[idx];
  }
};

export const deleteComponentById = async (id, userId) => {
  if (isMongoConnected()) {
    const res = await Component.deleteOne({ _id: id, user: userId });
    return res.deletedCount > 0;
  } else {
    ensureFiles();
    let components = JSON.parse(fs.readFileSync(COMPONENTS_FILE, 'utf8'));
    const initialLen = components.length;
    components = components.filter((c) => !( (c._id === id || c.id === id) && (c.user === userId || c.userId === userId) ));
    if (components.length < initialLen) {
      fs.writeFileSync(COMPONENTS_FILE, JSON.stringify(components, null, 2), 'utf8');
      return true;
    }
    return false;
  }
};
