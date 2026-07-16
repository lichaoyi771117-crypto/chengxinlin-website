'use client'

import { useState, useEffect } from 'react'
import { getCurrentUser, isAdmin, changePassword } from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface AuthorizationBinding {
  id: number
  code_id: number
  user_id: number
  bound_at: string
}

interface AuthorizationCode {
  id: number
  code: string
  qiaoxi_cap: number
  qiaoyuan_cap: number
  cxr_cap: number
  qiaoxi_used: number
  qiaoyuan_used: number
  cxr_used: number
  chenxi_used: number
  chenxi_unlimited: number
  is_active: number
  source: string
  order_id: number | null
  note: string
  created_by: string
  created_at: string
  expires_at: string | null
  binding: AuthorizationBinding | null
}

interface UserWithBinding {
  id: number
  account: string
  nickname: string
  phone: string
  email: string
  role: string
  created_at: string
  bound_at: string | null
  code_id: number | null
  code: string | null
  qiaoxi_cap: number | null
  qiaoyuan_cap: number | null
  cxr_cap: number | null
  qiaoxi_used: number | null
  qiaoyuan_used: number | null
  cxr_used: number | null
  chenxi_used: number | null
  chenxi_unlimited: number | null
  is_active: number | null
  expires_at: string | null
  source: string | null
}

// 管理员账号映射
const ADMIN_NICKNAMES: Record<string, string> = {
  'kscma': '昆明市供应链协会',
  'lxmjs': '霖信莯公司',
}

const ADMIN_QUOTA = 200

type Tab = 'codes' | 'members' | 'bind'

export default function AdminTrialPage() {
  const router = useRouter()
  const [codes, setCodes] = useState<AuthorizationCode[]>([])
  const [users, setUsers] = useState<UserWithBinding[]>([])
  const [unboundCodes, setUnboundCodes] = useState<AuthorizationCode[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<Tab>('codes')
  const [stats, setStats] = useState<{ freeCount: number; paidCount: number; incomeTotal: number; incomeCount: number }>({
    freeCount: 0, paidCount: 0, incomeTotal: 0, incomeCount: 0,
  })

  const [currentUser, setCurrentUser] = useState<{ account: string; nickname: string } | null>(null)

  const [showCreate, setShowCreate] = useState(false)
  const [createCount, setCreateCount] = useState(1)
  const [createMaxUses, setCreateMaxUses] = useState(10)
  const [createNote, setCreateNote] = useState('')
  const [creating, setCreating] = useState(false)

  const [copiedId, setCopiedId] = useState<number | null>(null)

  const [selectedCodeId, setSelectedCodeId] = useState<number | 0>(0)
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([])
  const [binding, setBinding] = useState(false)

  const [unbindUserIds, setUnbindUserIds] = useState<number[]>([])
  const [unbinding, setUnbinding] = useState(false)

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || !isAdmin()) {
      router.push('/')
      return
    }
    setCurrentUser({ account: user.account, nickname: ADMIN_NICKNAMES[user.account] || user.account })
    fetchAll()
  }, [router])

  // 退出登录后自动重定向：每 5 秒检查一次登录状态
  useEffect(() => {
    const interval = setInterval(() => {
      if (!getCurrentUser()) {
        router.push('/')
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [router])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const user = getCurrentUser()
      if (!user || !isAdmin()) { router.push('/'); return }

      const [codesRes, usersRes, unboundRes] = await Promise.all([
        fetch('/api/authcode/codes'),
        fetch('/api/admin/users'),
        fetch('/api/admin/bindings'),
      ])

      const codesData = await codesRes.json()
      const usersData = await usersRes.json()
      const unboundData = await unboundRes.json()

      if (codesData.codes) setCodes(codesData.codes)
      if (codesData.stats) setStats(codesData.stats)
      if (usersData.users) setUsers(usersData.users)
      if (unboundData.codes) setUnboundCodes(unboundData.codes)
    } catch (error) {
      console.error('Fetch data failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/authcode/codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
        fetchAll()
      } else {
        alert(data.error || '创建失败')
      }
    } catch (error) {
      console.error('Create codes failed:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleToggleActive = async (id: number, currentActive: number) => {
    try {
      await fetch('/api/authcode/codes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          action: currentActive ? 'deactivate' : 'activate',
        }),
      })
      fetchAll()
    } catch (error) {
      console.error('Toggle code failed:', error)
    }
  }

  const copyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleBind = async () => {
    if (!selectedCodeId || selectedUserIds.length === 0) {
      alert('请选择授权码和用户')
      return
    }
    setBinding(true)
    try {
      const res = await fetch('/api/admin/bindings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeId: selectedCodeId,
          userIds: selectedUserIds,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSelectedCodeId(0)
        setSelectedUserIds([])
        fetchAll()
        alert(`成功绑定 ${data.bound} 个用户`)
      } else {
        alert(data.error || '绑定失败')
      }
    } catch (error) {
      console.error('Bind failed:', error)
    } finally {
      setBinding(false)
    }
  }

  const handleUnbind = async () => {
    if (unbindUserIds.length === 0) {
      alert('请选择要解绑的用户')
      return
    }
    if (!confirm(`确认解绑 ${unbindUserIds.length} 个用户的授权码？`)) return

    setUnbinding(true)
    try {
      const res = await fetch('/api/admin/bindings', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: unbindUserIds,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setUnbindUserIds([])
        fetchAll()
        alert(`成功解绑 ${data.unbound} 个用户`)
      } else {
        alert(data.error || '解绑失败')
      }
    } catch (error) {
      console.error('Unbind failed:', error)
    } finally {
      setUnbinding(false)
    }
  }

  const getCodeStatus = (code: AuthorizationCode) => {
    if (!code.is_active) {
      return { text: '已禁用', color: 'bg-gray-100 text-gray-500' }
    }
    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      return { text: '已过期', color: 'bg-red-100 text-red-500' }
    }
    const totalUsed = code.qiaoxi_used + code.qiaoyuan_used + code.cxr_used
    const totalCap = code.qiaoxi_cap + code.qiaoyuan_cap + code.cxr_cap
    if (totalCap > 0 && totalUsed >= totalCap) {
      return { text: '已用完', color: 'bg-orange-100 text-orange-500' }
    }
    return { text: '有效', color: 'bg-green-100 text-green-500' }
  }

  const getUserTrialStatus = (user: UserWithBinding) => {
    if (!user.code_id) {
      return { text: '未绑定', color: 'bg-gray-100 text-gray-500' }
    }
    if (!user.is_active) {
      return { text: '已禁用', color: 'bg-gray-100 text-gray-500' }
    }
    if (user.expires_at && new Date(user.expires_at) < new Date()) {
      return { text: '已过期', color: 'bg-red-100 text-red-500' }
    }
    const totalUsed = (user.qiaoxi_used || 0) + (user.qiaoyuan_used || 0) + (user.cxr_used || 0)
    const totalCap = (user.qiaoxi_cap || 0) + (user.qiaoyuan_cap || 0) + (user.cxr_cap || 0)
    if (totalCap > 0 && totalUsed >= totalCap) {
      return { text: '已用完', color: 'bg-orange-100 text-orange-500' }
    }
    return { text: '有效', color: 'bg-green-100 text-green-500' }
  }

  const toggleUserSelection = (userId: number, list: number[], setList: (ids: number[]) => void) => {
    if (list.includes(userId)) {
      setList(list.filter(id => id !== userId))
    } else {
      setList([...list, userId])
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  const totalCodes = codes.length
  const unboundCodeCount = codes.filter(c => !c.binding).length
  const boundCodeCount = codes.filter(c => c.binding).length
  const exhaustedCodeCount = codes.filter(c => {
    const totalUsed = c.qiaoxi_used + c.qiaoyuan_used + c.cxr_used
    const totalCap = c.qiaoxi_cap + c.qiaoyuan_cap + c.cxr_cap
    return totalCap > 0 && totalUsed >= totalCap
  }).length

  // 仅统计管理员免费生成的码（付费码 created_by='SYSTEM'）
  const currentAdminCodes = currentUser ? codes.filter(c => c.source === 'admin_free' && c.created_by.toLowerCase() === currentUser.account.toLowerCase()).length : 0
  const remainingQuota = ADMIN_QUOTA - currentAdminCodes

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🎁 授权码与会员管理</h1>
            <p className="text-gray-500 mt-1">管理授权码：分配给注册会员，或由客户付费自助购买</p>
            {currentUser && (
              <p className="text-xs text-gray-400 mt-1">
                当前管理员：{currentUser.nickname}（{currentUser.account}）· 免费额度已用 {currentAdminCodes}/{ADMIN_QUOTA}（剩余 {remainingQuota}）
              </p>
            )}
          </div>
          {activeTab === 'codes' && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <span>+</span>
                <span>生成授权码</span>
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <span>🔑</span>
                <span>修改密码</span>
              </button>
            </div>
          )}
        </div>

        {/* 统计卡片 */}
        <div className="grid md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">总授权码数</div>
            <div className="text-2xl font-bold text-gray-900">{totalCodes}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">未绑定</div>
            <div className="text-2xl font-bold text-blue-600">{unboundCodeCount}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">已绑定</div>
            <div className="text-2xl font-bold text-green-600">{boundCodeCount}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">已用完</div>
            <div className="text-2xl font-bold text-orange-500">{exhaustedCodeCount}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">付费授权码</div>
            <div className="text-2xl font-bold text-purple-600">{stats.paidCount}</div>
            <div className="text-xs text-gray-400 mt-1">客户自助购买</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm text-gray-500 mb-1">累计收入</div>
            <div className="text-2xl font-bold text-emerald-600">¥{stats.incomeTotal}</div>
            <div className="text-xs text-gray-400 mt-1">{stats.incomeCount} 笔已支付</div>
          </div>
        </div>

        {/* Tab导航 */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {[
            { key: 'codes', label: '授权码管理' },
            { key: 'members', label: '会员管理' },
            { key: 'bind', label: '绑定操作' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: 授权码管理 */}
        {activeTab === 'codes' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">授权码</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">开通时间</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">到期时间</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">来源</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">绑定用户</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">乔曦</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">峤远</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">程晓融</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建者</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">备注</th>
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
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getCodeStatus(code).color}`}>
                          {getCodeStatus(code).text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-xs text-gray-500 whitespace-nowrap">
                        {new Date(code.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 text-center text-xs whitespace-nowrap">
                        {code.expires_at ? (
                          <span className={new Date(code.expires_at) < new Date() ? 'text-red-500' : 'text-gray-600'}>
                            {new Date(code.expires_at).toLocaleDateString('zh-CN')}
                          </span>
                        ) : (
                          <span className="text-gray-400">永久</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${code.source === 'paid' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                          {code.source === 'paid' ? '付费' : code.source === 'trial' ? '试用' : code.source === 'admin' ? '管理' : '免费'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm">
                        {code.binding ? (
                          <span className="text-blue-600">
                            #{code.binding.user_id}
                          </span>
                        ) : (
                          <span className="text-gray-400">未绑定</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={code.qiaoxi_used >= code.qiaoxi_cap ? 'text-red-500' : 'text-gray-900'}>
                          {code.qiaoxi_used}
                        </span>
                        <span className="text-gray-400">/{code.qiaoxi_cap}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={code.qiaoyuan_used >= code.qiaoyuan_cap ? 'text-red-500' : 'text-gray-900'}>
                          {code.qiaoyuan_used}
                        </span>
                        <span className="text-gray-400">/{code.qiaoyuan_cap}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={code.cxr_used >= code.cxr_cap ? 'text-red-500' : 'text-gray-900'}>
                          {code.cxr_used}
                        </span>
                        <span className="text-gray-400">/{code.cxr_cap}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {code.source === 'paid' ? '系统自动' : (ADMIN_NICKNAMES[code.created_by.toLowerCase()] || code.created_by || '-')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{code.note || '-'}</td>
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
                暂无授权码，点击"生成授权码"创建
              </div>
            )}
          </div>
        )}

        {/* Tab 2: 会员管理 */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">昵称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注册时间</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">授权码状态</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">绑定码</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{user.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.account}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.nickname || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString('zh-CN')}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getUserTrialStatus(user).color}`}>
                          {getUserTrialStatus(user).text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm font-mono">
                        {user.code ? (
                          <span className="text-blue-600">{user.code}</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                暂无会员注册
              </div>
            )}
          </div>
        )}

        {/* Tab 3: 绑定操作 */}
        {activeTab === 'bind' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">新建绑定</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">选择授权码</label>
                <select
                  value={selectedCodeId}
                  onChange={e => setSelectedCodeId(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value={0}>请选择未绑定的授权码</option>
                  {unboundCodes.map(code => (
                    <option key={code.id} value={code.id}>
                      {code.code} ({code.qiaoxi_cap}次/产品)
                    </option>
                  ))}
                </select>
                {unboundCodes.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">暂无未绑定的授权码</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择用户（{selectedUserIds.length} 已选）
                </label>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {users.filter(u => !u.code_id).map(user => (
                    <label
                      key={user.id}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id, selectedUserIds, setSelectedUserIds)}
                        className="rounded text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-700">
                        {user.nickname || user.account} ({user.account})
                      </span>
                    </label>
                  ))}
                  {users.filter(u => !u.code_id).length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-400">所有用户都已绑定授权码</div>
                  )}
                </div>
              </div>

              <button
                onClick={handleBind}
                disabled={binding || !selectedCodeId || selectedUserIds.length === 0}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {binding ? '绑定中...' : `确认绑定 ${selectedUserIds.length} 个用户`}
              </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">批量解绑</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择要解绑的用户（{unbindUserIds.length} 已选）
                </label>
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  {users.filter(u => u.code_id).map(user => (
                    <label
                      key={user.id}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={unbindUserIds.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id, unbindUserIds, setUnbindUserIds)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">
                        {user.nickname || user.account} ({user.account})
                      </span>
                      <span className="text-xs font-mono text-gray-400 ml-auto">{user.code}</span>
                    </label>
                  ))}
                  {users.filter(u => u.code_id).length === 0 && (
                    <div className="px-4 py-3 text-sm text-gray-400">暂无已绑定的用户</div>
                  )}
                </div>
              </div>

              <button
                onClick={handleUnbind}
                disabled={unbinding || unbindUserIds.length === 0}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {unbinding ? '解绑中...' : `确认解绑 ${unbindUserIds.length} 个用户`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 创建弹窗 */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">生成授权码</h2>

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
                <p className="text-xs text-gray-500 mt-1">
                  本管理员免费额度剩余：{remainingQuota} 个
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">每个产品可用次数</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={createMaxUses}
                  onChange={e => setCreateMaxUses(parseInt(e.target.value) || 10)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">乔曦/峤远/程晓融各{createMaxUses}次，陈曦不限次数</p>
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
                  disabled={creating || currentAdminCodes + createCount > ADMIN_QUOTA}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {creating ? '生成中...' : '确认生成'}
                </button>
              </div>
              {currentAdminCodes + createCount > ADMIN_QUOTA && (
                <p className="text-xs text-red-500 text-center">
                  超出免费额度，超出部分请让客户在「购买授权码」页面付费购买
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 密码修改弹窗 */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">修改密码</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="输入当前密码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="至少6个字符"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="再次输入新密码"
                />
              </div>

              {passwordError && (
                <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                  {passwordError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setShowPasswordModal(false)
                    setOldPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setPasswordError('')
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={async () => {
                    if (!oldPassword || !newPassword || !confirmPassword) {
                      setPasswordError('请填写所有字段')
                      return
                    }
                    if (newPassword.length < 6) {
                      setPasswordError('新密码至少6个字符')
                      return
                    }
                    if (newPassword !== confirmPassword) {
                      setPasswordError('两次输入的新密码不一致')
                      return
                    }

                    setChangingPassword(true)
                    setPasswordError('')
                    try {
                      const result = await changePassword({
                        oldPassword,
                        newPassword,
                      })
                      if (result.success) {
                        alert('密码修改成功！请使用新密码重新登录')
                        localStorage.removeItem('cxl_user')
                        router.push('/')
                      } else {
                        setPasswordError(result.error || '修改失败')
                      }
                    } catch (error) {
                      setPasswordError('网络错误，请重试')
                    } finally {
                      setChangingPassword(false)
                    }
                  }}
                  disabled={changingPassword}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {changingPassword ? '修改中...' : '确认修改'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
