const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { memberData } = event;
  
  try {
    const result = await db.collection('members').add({
      data: {
        ...memberData,
        createTime: new Date(),
        updateTime: new Date(),
        creator: context.OPENID
      }
    });
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
