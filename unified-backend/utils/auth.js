const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * 哈希密码
 */
async function hashPassword(password) {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error('密码哈希失败:', error);
    throw new Error('密码加密失败');
  }
}

/**
 * 验证密码
 */
async function comparePassword(password, hash) {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (error) {
    console.error('密码验证失败:', error);
    throw new Error('密码验证失败');
  }
}

module.exports = {
  hashPassword,
  comparePassword
};
