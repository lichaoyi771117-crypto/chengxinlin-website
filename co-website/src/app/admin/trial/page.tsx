'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, isAdmin } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface TrialCode {
  id: number
  code: string
  max_uses: number
  qiaoxi_used: number
  qiaoyuan_used: number
  cxr_used: number
  is_active: number
  note: string
  created_at: string
  expires_at: string | null
}

export default function AdminTrialPage() {
  const router = useRouter()
  const [codes, setCodes] = useState<TrialCode[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [createCount, setCreateCount] = useState(1)
  const [createMaxUses, setCreateMaxUses] = useState(5)
  const [createNote, setCreateNote] = useState('')
  const [creating, setCreating] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || !isAdmin()) {
      router.push('/')
      return
    }
    fetchCodes()
  }, [router])

  const fetchCodes = async () => {
    try {
      const user = getCurrentUser()
      const res = await fetch('/api/trial/codes', {
        headers: { 'x-user-account': user?.account || '' },
      })
      const data = await res.json()
      if (data.codes) {
        setCodes(data.codes)
      }
    } catch (error) {
      console.error('Fetch codes failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    try {
      const user = getCurrentUser()
      const res = await fetch('/api/trial/codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-account': user?.account || '',
        },
        body: JSON.stringify({
          count: createCount,
          maxUses: createMaxUses,
          note: createNote,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setShowCreate(false)
        setCreateNote('')
        fetchCodes()
      }
    } catch (error) {
      console.error('Create codes failed:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleToggleActive = async (id: number, currentActive: number) => {
    try {
      const user = getCurrentUser()
      await fetch('/api/trial/codes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-account': user?.account || '',
        },
        body: JSON.stringify({
          id,
          action: currentActive ? 'deactivate' : 'activate',
        }),
      })
      fetchCodes()
    } catch (error) {
      console.error('Toggle code failed:', error)
    }
  }

  const copyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (code: TrialCode) => {
    if (!code.is_active) {
      return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">已禁用</span>
    }
    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      return <span className="px-2 py-1 text-xs bg-red-100 text-red-500 rounded-full">已过期</span>
    }
    const totalUsed = code.qiaoxi_used + code.qiaoyuan_used + code.cxr_used
    const totalMax = code.max_uses * 3
    if (totalUsed >= totalMax) {
      return <span className="px-2 py-1 text-xs bg-orange-100 text-orange-500 rounded-full">已用完</span>
    }
    return <span className="px-2 py-1 text-xs bg-green-100 text-green-500 rounded-full">有效</span>
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🎁 体验码管理</h1>
            <p className="text-gray-500 mt-1">创建和管理免费体验码</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>+</span>
            <span>生成体验码</span>
          </button>
        </div>

        {/* 统计卡片 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">总体验码数</div>
            <div className="text-2xl font-bold text-gray-900">{codes.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">有效体验码</div>
            <div className="text-2xl font-bold text-green-600">
              {codes.filter(c => c.is_active).length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">已用完</div>
            <div className="text-2xl font-bold text-orange-500">
              {codes.filter(c => (c.qiaoxi_used + c.qiaoyuan_used + c.cxr_used) >= c.max_uses * 3).length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">已禁用</div>
            <div className="text-2xl font-bold text-gray-400">
              {codes.filter(c => !c.is_active).length}
            </div>
          </div>
        </div>

        {/* 体验码列表 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">体验码</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">乔曦</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">峤远</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">程晓融</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">备注</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {codes.map((code) => (
                  <tr key={code.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{code.code}</code>
                        <button
                          onClick={() => copyCode(code.code, code.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title="复制"
                        >
                          {copiedId === code.id ? '✅' : '📋'}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(code)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={code.qiaoxi_used >= code.max_uses ? 'text-red-500' : 'text-gray-900'}>
                        {code.qiaoxi_used}
                      </span>
                      <span className="text-gray-400">/{code.max_uses}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={code.qiaoyuan_used >= code.max_uses ? 'text-red-500' : 'text-gray-900'}>
                        {code.qiaoyuan_used}
                      </span>
                      <span className="text-gray-400">/{code.max_uses}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={code.cxr_used >= code.max_uses ? 'text-red-500' : 'text-gray-900'}>
                        {code.cxr_used}
                      </span>
                      <span className="text-gray-400">/{code.max_uses}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{code.note || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(code.created_at).toLocaleDateString('zh-CN')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(code.id, code.is_active)}
                        className={`text-sm ${code.is_active ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
                      >
                        {code.is_active ? '禁用' : '启用'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {codes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              暂无体验码，点击"生成体验码"创建
            </div>
          )}
        </div>
      </div>

      {/* 创建弹窗 */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">生成体验码</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">生成数量</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={createCount}
                  onChange={e => setCreateCount(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">每个产品可用次数</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={createMaxUses}
                  onChange={e => setCreateMaxUses(parseInt(e.target.value) || 5)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">3个产品各{createMaxUses}次，共{createMaxUses * 3}次体验</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注（选填）</label>
                <input
                  type="text"
                  value={createNote}
                  onChange={e => setCreateNote(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="如：发放给XX客户"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {creating ? '生成中...' : '确认生成'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
