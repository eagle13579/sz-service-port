const RewardRecord = require('../models/RewardRecord');
const Member = require('../models/Member');
const db = require('../config/database');

// 获取收益统计
exports.getStatistics = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const statistics = await RewardRecord.getStatistics(member.id);

    res.json({
      code: 200,
      message: '获取收益统计成功',
      data: statistics
    });
  } catch (error) {
    console.error('获取收益统计失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取收益统计失败',
      error: error.message
    });
  }
};

// 获取回报记录
exports.getRecords = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const { page = 1, pageSize = 20, status } = req.query;
    const result = await RewardRecord.getByMemberId(member.id, { page, pageSize, status });

    res.json({
      code: 200,
      message: '获取回报记录成功',
      data: result
    });
  } catch (error) {
    console.error('获取回报记录失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取回报记录失败',
      error: error.message
    });
  }
};

// 申请提现
exports.withdraw = async (req, res) => {
  try {
    const userId = req.userId;
    const member = await Member.findByUserId(userId);

    if (!member) {
      return res.status(404).json({
        code: 404,
        message: '会员档案不存在'
      });
    }

    const { amount, bank_account, bank_name, account_name } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        code: 400,
        message: '提现金额必须大于0'
      });
    }

    if (!bank_account || !bank_name || !account_name) {
      return res.status(400).json({
        code: 400,
        message: '银行账户信息不完整'
      });
    }

    // 检查可用余额
    const [balance] = await db.query(`
      SELECT COALESCE(SUM(amount), 0) as total_income
      FROM reward_records
      WHERE member_id = ? AND reward_type = 'cash' AND status = 'settled'
    `, [member.id]);

    const [pendingWithdrawals] = await db.query(`
      SELECT COALESCE(SUM(amount), 0) as pending_amount
      FROM reward_records
      WHERE member_id = ? AND status = 'withdrawing'
    `, [member.id]);

    const availableBalance = balance.total_income - pendingWithdrawals.pending_amount;

    if (amount > availableBalance) {
      return res.status(400).json({
        code: 400,
        message: '提现金额超过可用余额'
      });
    }

    // 创建提现记录
    const recordId = await RewardRecord.create({
      member_id: member.id,
      reward_type: 'cash',
      amount: -amount,
      status: 'withdrawing',
      description: `提现至银行账户（${bank_name}）`
    });

    // 保存银行账户信息
    await db.query(`
      INSERT INTO withdraw_records (reward_record_id, bank_account, bank_name, account_name)
      VALUES (?, ?, ?, ?)
    `, [recordId, bank_account, bank_name, account_name]);

    res.json({
      code: 200,
      message: '提现申请提交成功',
      data: { recordId }
    });
  } catch (error) {
    console.error('提现申请失败:', error);
    res.status(500).json({
      code: 500,
      message: '提现申请失败',
      error: error.message
    });
  }
};
