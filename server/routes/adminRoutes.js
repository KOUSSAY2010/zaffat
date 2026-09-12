import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { protectAdmin } from '../middleware/auth.js';
import { Admin } from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Fallback credentials file path
const credentialsFile = path.join(__dirname, '..', 'uploads', 'admin_credentials.json');

// Helper to get persistent stored admin credentials
const getStoredCredentials = async () => {
  const defaultUser = process.env.ADMIN_USERNAME;
  const defaultPass = process.env.ADMIN_PASSWORD;

  // 1. Check MongoDB if connected
  if (mongoose.connection.readyState === 1) {
    let admin = await Admin.findOne({ username: defaultUser });
    if (!admin) {
      // Check if fallback file has a modified password
      let initialPassword = defaultPass;
      if (fs.existsSync(credentialsFile)) {
        try {
          const fileData = JSON.parse(fs.readFileSync(credentialsFile, 'utf-8'));
          if (fileData.password) initialPassword = fileData.password;
        } catch (_) {}
      }
      const hashedPassword = initialPassword.startsWith('$2a$') || initialPassword.startsWith('$2b$')
        ? initialPassword
        : await bcrypt.hash(initialPassword, 10);
      admin = await Admin.create({ username: defaultUser, password: hashedPassword });
    }
    return { username: admin.username, password: admin.password, model: admin };
  }

  // 2. Check local fallback credentials file
  if (fs.existsSync(credentialsFile)) {
    try {
      const fileData = JSON.parse(fs.readFileSync(credentialsFile, 'utf-8'));
      if (fileData.username && fileData.password) {
        return { username: fileData.username, password: fileData.password };
      }
    } catch (_) {}
  }

  // 3. Fallback to .env values
  return { username: defaultUser, password: defaultPass };
};

// Helper to save new admin password
const saveNewPassword = async (hashedPassword) => {
  const defaultUser = process.env.ADMIN_USERNAME;

  // 1. Save in MongoDB if connected
  if (mongoose.connection.readyState === 1) {
    let admin = await Admin.findOne({ username: defaultUser });
    if (!admin) {
      admin = new Admin({ username: defaultUser });
    }
    admin.password = hashedPassword;
    await admin.save();
  }

  // 2. Save in fallback credentials file
  try {
    const dir = path.dirname(credentialsFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      credentialsFile,
      JSON.stringify(
        {
          username: defaultUser,
          password: hashedPassword,
          updatedAt: new Date().toISOString(),
        },
        null,
        2
      ),
      'utf-8'
    );
  } catch (err) {
    console.warn('Could not write fallback credentials file:', err.message);
  }
};

// @route   POST /api/admin/login
// @desc    Admin login and return JWT token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال اسم المستخدم وكلمة المرور.',
      });
    }

    const credentials = await getStoredCredentials();
    const envUser = process.env.ADMIN_USERNAME;
    const envPass = process.env.ADMIN_PASSWORD;

    let isMatch = false;
    // Allow login if matching the env/default password or stored credentials
    if (username === envUser && password === envPass) {
      isMatch = true;
    } else if (username === credentials.username) {
      if (credentials.password.startsWith('$2a$') || credentials.password.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, credentials.password);
      } else {
        isMatch = password === credentials.password;
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'بيانات الدخول غير صحيحة، يرجى التحقق من اسم المستخدم وكلمة المرور.',
      });
    }

    const secret = process.env.JWT_SECRET || 'atyaf_zaffat_jwt_secret_key_vps_staging_2026_super_secure';
    const token = jwt.sign(
      {
        username,
        role: 'admin',
      },
      secret,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح.',
      token,
      admin: {
        username,
        role: 'admin',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم أثناء تسجيل الدخول.',
    });
  }
});

// @route   GET /api/admin/verify
// @desc    Verify current JWT token
// @access  Protected
router.get('/verify', protectAdmin, (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin,
  });
});

// @route   PUT /api/admin/change-password
// @desc    Change admin password
// @access  Protected
router.put('/change-password', protectAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال كلمة المرور الحالية وكلمة المرور الجديدة.',
      });
    }

    if (newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.',
      });
    }

    const credentials = await getStoredCredentials();

    let isMatch = false;
    if (credentials.password.startsWith('$2a$') || credentials.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(currentPassword, credentials.password);
    } else {
      isMatch = currentPassword === credentials.password;
    }

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور الحالية غير صحيحة.',
      });
    }

    // Hash the new password securely
    const hashedNewPassword = await bcrypt.hash(newPassword.trim(), 10);
    await saveNewPassword(hashedNewPassword);

    return res.status(200).json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح. يرجى استخدام كلمة المرور الجديدة في المرات القادمة.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم أثناء تغيير كلمة المرور.',
      error: error.message,
    });
  }
});

export default router;
