const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { familyId, limit = 100, skip = 0 } = event;
  
  try {
    const result = await db.collection('members')
      .where({
        familyId: familyId || db.command.exists(true)
      })
      .orderBy('generation', 'asc')
      .orderBy('createTime', 'asc')
      .skip(skip)
      .limit(limit)
      .get();
    
    return {
      success: true,
      data: result.data,
      total: result.data.length
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
