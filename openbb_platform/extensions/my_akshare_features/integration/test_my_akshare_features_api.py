"""测试自定义 AKShare 功能的 API 集成."""

import pytest
import requests


class TestMyAkShareFeaturesAPI:
    """测试自定义 AKShare 功能 API."""

    @pytest.fixture(scope="session", autouse=True)
    def headers(self):
        """设置请求头."""
        userdata = {"username": "test_user", "email": "test_email", "token": "test_token"}
        return {"Authorization": f"Bearer {userdata['token']}"}

    @pytest.fixture(scope="session", autouse=True)
    def base_url(self):
        """设置基础 URL."""
        return "http://localhost:8000/api/v1"

    def test_longhu_bang_daily(self, headers, base_url):
        """测试获取每日龙虎榜数据."""
        url = f"{base_url}/longhu_bang/daily"
        response = requests.get(url, headers=headers, timeout=10)
        assert response.status_code == 200
        
        data = response.json()
        assert "results" in data
        
        # 如果有数据，验证数据结构
        if data["results"]:
            result = data["results"][0]
            # 检查是否包含预期的字段
            expected_fields = ["code", "name"]
            for field in expected_fields:
                assert field in result or any(field in str(k) for k in result.keys())

    def test_longhu_bang_stock_history(self, headers, base_url):
        """测试获取指定股票的龙虎榜历史数据."""
        url = f"{base_url}/longhu_bang/stock_history"
        params = {"symbol": "000001"}
        response = requests.get(url, headers=headers, params=params, timeout=10)
        assert response.status_code == 200
        
        data = response.json()
        assert "results" in data
