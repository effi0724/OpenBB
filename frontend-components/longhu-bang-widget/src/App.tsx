import React, { useState, useEffect } from 'react';
import LonghuBangTable from './components/LonghuBangTable';
import { LonghuBangItem, ApiResponse } from './types';
import { RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';

function App() {
  const [data, setData] = useState<LonghuBangItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // 获取龙虎榜数据
  const fetchLonghuBangData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('正在获取龙虎榜数据...');
      
              // 调用我们自定义的 API 端点
        const response = await fetch('/api/v1/my_akshare_features/longhu_bang/daily', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      
      console.log('API 响应:', result);

      if (result.extra?.error) {
        throw new Error(result.extra.error);
      }

      setData(result.results || []);
      setLastUpdate(new Date());
      
      console.log(`成功获取到 ${result.results?.length || 0} 条龙虎榜数据`);
      
    } catch (err) {
      console.error('获取龙虎榜数据失败:', err);
      setError(err instanceof Error ? err.message : '获取数据失败');
      
      // 如果是开发环境，设置一些模拟数据用于展示
      if (process.env.NODE_ENV === 'development') {
        setData([
          {
            code: '000001',
            name: '平安银行',
            reason: '日涨幅偏离值达7%的证券',
            close_price: 12.34,
            change_percent: 8.45,
            amount: 125000000,
            buy_amount: 78000000,
            sell_amount: 47000000,
            net_amount: 31000000,
            date: '2024-01-15'
          },
          {
            code: '000002',
            name: '万科A',
            reason: '日跌幅偏离值达7%的证券',
            close_price: 18.67,
            change_percent: -9.12,
            amount: 98000000,
            buy_amount: 35000000,
            sell_amount: 63000000,
            net_amount: -28000000,
            date: '2024-01-15'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    fetchLonghuBangData();
  }, []);

  // 手动刷新数据
  const handleRefresh = () => {
    fetchLonghuBangData();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-primary-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">龙虎榜数据</h1>
                <p className="text-gray-600 mt-1">
                  实时显示沪深两市龙虎榜上榜股票信息
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {lastUpdate && (
                <span className="text-sm text-gray-500">
                  最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
                </span>
              )}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>{loading ? '刷新中...' : '刷新数据'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-red-800">数据获取失败</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                {process.env.NODE_ENV === 'development' && (
                  <p className="text-sm text-red-600 mt-2">
                    开发环境提示：请确保 OpenBB API 服务正在运行 (http://localhost:6900)
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {loading && !error && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-6 h-6 animate-spin text-primary-600" />
              <span className="text-lg text-gray-600">正在加载龙虎榜数据...</span>
            </div>
          </div>
        )}

        {/* 数据统计 */}
        {!loading && data.length > 0 && (
          <div className="mb-6 bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{data.length}</div>
                <div className="text-sm text-gray-600">上榜股票数量</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {data.filter(item => {
                    const change = Number(item.change_percent || item['涨跌幅']);
                    return !isNaN(change) && change > 0;
                  }).length}
                </div>
                <div className="text-sm text-gray-600">上涨股票</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {data.filter(item => {
                    const change = Number(item.change_percent || item['涨跌幅']);
                    return !isNaN(change) && change < 0;
                  }).length}
                </div>
                <div className="text-sm text-gray-600">下跌股票</div>
              </div>
            </div>
          </div>
        )}

        {/* 数据表格 */}
        {!loading && data.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <LonghuBangTable data={data} />
          </div>
        )}

        {/* 无数据状态 */}
        {!loading && !error && data.length === 0 && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无龙虎榜数据</h3>
            <p className="text-gray-500">今日可能还没有股票上榜，请稍后刷新查看</p>
          </div>
        )}

        {/* 页脚信息 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>数据来源: AKShare | OpenBB 平台</p>
          <p className="mt-1">
            此数据仅供参考，投资有风险，入市需谨慎
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
