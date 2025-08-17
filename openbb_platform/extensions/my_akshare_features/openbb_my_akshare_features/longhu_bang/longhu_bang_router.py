"""龙虎榜数据路由器."""

from typing import Any, Dict, List
import warnings

from openbb_core.app.model.command_context import CommandContext
from openbb_core.app.model.example import APIEx
from openbb_core.app.model.obbject import OBBject
from openbb_core.app.provider_interface import (
    ExtraParams,
    ProviderChoices,
    StandardParams,
)
from openbb_core.app.query import Query
from openbb_core.app.router import Router


router = Router(prefix="/longhu_bang", description="龙虎榜数据接口")


@router.command(
    examples=[
        APIEx(
            description="获取最新的龙虎榜数据",
            parameters={"provider": "akshare"}
        ),
    ],
)
def daily() -> OBBject[List[Dict[str, Any]]]:
    """
    获取每日龙虎榜数据。
    
    这个端点直接调用 akshare 库获取中国股市的龙虎榜数据。
    龙虎榜显示每日交易异常波动的股票及其主要买卖营业部信息。
    
    Returns
    -------
    OBBject[List[LonghuBangData]]
        包含龙虎榜数据的 OBBject，包括股票代码、名称、上榜原因、
        价格变动、成交金额等信息。
    """
    
    try:
        # 导入 akshare 库
        import akshare as ak
        import pandas as pd
        
        # 忽略 akshare 的警告信息
        warnings.filterwarnings('ignore')
        
        print("正在通过自定义端点直接调用 akshare 获取龙虎榜数据...")
        
        # 直接调用 akshare 函数获取龙虎榜数据
        longhu_df: pd.DataFrame = ak.stock_lhb_detail_em()
        
        # 检查数据是否为空
        if longhu_df.empty:
            return OBBject(results=[])
        
        # 数据清理和转换
        # 重命名列名以便更好地处理
        column_mapping = {
            '代码': 'code',
            '名称': 'name', 
            '解读': 'reason',
            '收盘价': 'close_price',
            '涨跌幅': 'change_percent',
            '龙虎榜成交额': 'amount',
            '买入额': 'buy_amount',
            '卖出额': 'sell_amount',
            '净额': 'net_amount',
            '上榜日': 'date'
        }
        
        # 重命名存在的列
        existing_columns = {k: v for k, v in column_mapping.items() if k in longhu_df.columns}
        longhu_df = longhu_df.rename(columns=existing_columns)
        
        # 确保数据类型正确
        numeric_columns = ['close_price', 'change_percent', 'amount', 'buy_amount', 'sell_amount', 'net_amount']
        for col in numeric_columns:
            if col in longhu_df.columns:
                longhu_df[col] = pd.to_numeric(longhu_df[col], errors='coerce')
        
        # 转换为字典列表
        results = longhu_df.to_dict(orient="records")
        
        # 限制返回的记录数量（可选）
        if len(results) > 100:
            results = results[:100]
        
        print(f"成功获取到 {len(results)} 条龙虎榜数据")
        
        return OBBject(results=results)
        
    except ImportError as e:
        error_msg = f"无法导入 akshare 库: {str(e)}"
        print(error_msg)
        return OBBject(results=[], extra={"error": error_msg})
        
    except Exception as e:
        error_msg = f"获取龙虎榜数据时出错: {str(e)}"
        print(error_msg)
        return OBBject(results=[], extra={"error": error_msg})


@router.command(
    examples=[
        APIEx(
            description="获取指定股票的龙虎榜历史数据",
            parameters={"symbol": "000001", "provider": "akshare"}
        ),
    ],
)
def stock_history(
    symbol: str = "000001",
) -> OBBject[List[Dict[str, Any]]]:
    """
    获取指定股票的龙虎榜历史数据。
    
    Parameters
    ----------
    symbol : str
        股票代码，例如 '000001'
        
    Returns
    -------
    OBBject[List[Dict[str, Any]]]
        包含指定股票龙虎榜历史数据的 OBBject
    """
    
    try:
        import akshare as ak
        import pandas as pd
        
        warnings.filterwarnings('ignore')
        
        print(f"正在获取股票 {symbol} 的龙虎榜历史数据...")
        
        # 获取指定股票的龙虎榜数据
        stock_lhb_df: pd.DataFrame = ak.stock_lhb_stock_statistic_em(symbol=symbol)
        
        if stock_lhb_df.empty:
            return OBBject(results=[])
        
        # 转换为字典列表
        results = stock_lhb_df.to_dict(orient="records")
        
        print(f"成功获取到股票 {symbol} 的 {len(results)} 条龙虎榜历史数据")
        
        return OBBject(results=results)
        
    except Exception as e:
        error_msg = f"获取股票 {symbol} 龙虎榜数据时出错: {str(e)}"
        print(error_msg)
        return OBBject(results=[], extra={"error": error_msg})
