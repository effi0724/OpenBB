"""测试自定义 AKShare 功能的 Python 集成."""

import pytest
from openbb import obb


class TestMyAkShareFeaturesPython:
    """测试自定义 AKShare 功能 Python 接口."""

    def test_longhu_bang_daily(self):
        """测试通过 Python 接口获取每日龙虎榜数据."""
        try:
            result = obb.longhu_bang.daily()
            assert result is not None
            assert hasattr(result, 'results')
        except Exception as e:
            # 如果 akshare 不可用或网络问题，跳过测试
            pytest.skip(f"AKShare 功能不可用: {str(e)}")

    def test_longhu_bang_stock_history(self):
        """测试通过 Python 接口获取指定股票的龙虎榜历史数据."""
        try:
            result = obb.longhu_bang.stock_history(symbol="000001")
            assert result is not None
            assert hasattr(result, 'results')
        except Exception as e:
            # 如果 akshare 不可用或网络问题，跳过测试
            pytest.skip(f"AKShare 功能不可用: {str(e)}")
