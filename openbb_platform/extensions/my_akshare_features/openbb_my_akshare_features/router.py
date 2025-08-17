"""自定义 AKShare 功能主路由器."""

from openbb_core.app.router import Router
from openbb_my_akshare_features.longhu_bang.longhu_bang_router import router as longhu_bang_router

# 创建主路由器
router = Router(prefix="", description="自定义 AKShare 功能扩展，提供中国股市数据接口。")

# 包含龙虎榜路由器
router.include_router(longhu_bang_router)
