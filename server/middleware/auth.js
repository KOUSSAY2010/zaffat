import jwt from 'jsonwebtoken';

export const protectAdmin = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'atyaf_zaffat_jwt_secret_key_vps_staging_2026_super_secure';
      const decoded = jwt.verify(token, secret);
      req.admin = decoded;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'جلسة الدخول غير صالحة أو منتهية، يرجى تسجيل الدخول مجدداً.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'غير مصرح بالدخول. رمز التحقق غير متوفر.',
    });
  }
};
