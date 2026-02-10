'use client'

import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { 
  UsersIcon,
  PlusIcon,
  TrashIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import Link from 'next/link'

interface AdminUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  disabled: boolean
  metadata: {
    creationTime: string
    lastSignInTime: string | null
  }
  customClaims: Record<string, any>
  isAdmin: boolean
}

export default function AdminUsersPage() {
  const { user, logout, loading: authLoading, isAdmin } = useAuthContext()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  
  // Add user form state
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserDisplayName, setNewUserDisplayName] = useState('')

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/admin/login')
    }
  }, [user, isAdmin, authLoading, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/users?adminOnly=true&limit=1000')
      if (!response.ok) {
        throw new Error('Failed to fetch admin users')
      }
      const data = await response.json()
      setUsers(data.users || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch admin users')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && isAdmin && !authLoading) {
      fetchUsers()
    }
  }, [user, isAdmin, authLoading])

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      setError('Email and password are required')
      return
    }

    setIsAdding(true)
    setError(null)
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          displayName: newUserDisplayName || undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create admin user')
      }

      const data = await response.json()
      
      // Reset form
      setNewUserEmail('')
      setNewUserPassword('')
      setNewUserDisplayName('')
      setShowAddModal(false)
      
      // Refresh users list
      await fetchUsers()
    } catch (err: any) {
      setError(err.message || 'Failed to add admin user')
      console.error('Error adding user:', err)
    } finally {
      setIsAdding(false)
    }
  }

  const handleDeleteClick = (userToDelete: AdminUser) => {
    setUserToDelete(userToDelete)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async (removeAdminOnly: boolean = false) => {
    if (!userToDelete) return
    
    setIsDeleting(true)
    setError(null)
    
    try {
      const response = await fetch(
        `/api/users?uid=${userToDelete.uid}&removeAdminOnly=${removeAdminOnly}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to remove admin user')
      }

      setShowDeleteModal(false)
      setUserToDelete(null)
      await fetchUsers()
    } catch (err: any) {
      setError(err.message || 'Failed to remove admin user')
      console.error('Error removing user:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-secondary-900">Admin Users</h1>
                <p className="text-secondary-600">Manage admin user accounts</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Admin User</span>
              </button>
              <button
                onClick={handleLogout}
                className="btn text-red-600 hover:text-red-700 hover:border-red-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-600">Loading admin users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Admin Users</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first admin user.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Admin User</span>
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Sign In
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((adminUser) => (
                      <tr key={adminUser.uid} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              {adminUser.photoURL ? (
                                <img
                                  src={adminUser.photoURL}
                                  alt={adminUser.displayName || adminUser.email || 'User'}
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                <UsersIcon className="h-6 w-6 text-primary-600" />
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {adminUser.displayName || 'No name'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {adminUser.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {adminUser.isAdmin ? (
                              <>
                                <ShieldCheckIcon className={`h-5 w-5 ${adminUser.email === 'admin@clearviewretreat.org' ? 'text-purple-500' : 'text-green-500'}`} />
                                <span className={`text-sm font-medium ${adminUser.email === 'admin@clearviewretreat.org' ? 'text-purple-700' : 'text-green-700'}`}>
                                  {adminUser.email === 'admin@clearviewretreat.org' ? 'Super Admin' : 'Admin'}
                                </span>
                              </>
                            ) : (
                              <>
                                <ShieldExclamationIcon className="h-5 w-5 text-gray-400" />
                                <span className="text-sm text-gray-500">User</span>
                              </>
                            )}
                            {adminUser.disabled && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Disabled
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(adminUser.metadata.creationTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(adminUser.metadata.lastSignInTime || null)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {adminUser.uid !== user?.uid && adminUser.email !== 'admin@clearviewretreat.org' && (
                            <button
                              onClick={() => handleDeleteClick(adminUser)}
                              className="text-red-600 hover:text-red-900"
                              title="Remove Admin Access"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          )}
                          {adminUser.uid === user?.uid && (
                            <span className="text-gray-400 text-xs">(Current user)</span>
                          )}
                          {adminUser.email === 'admin@clearviewretreat.org' && (
                            <span className="text-gray-400 text-xs">(Super Admin)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      <Transition.Root show={showAddModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => !isAdding && setShowAddModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                      <PlusIcon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Add Admin User
                      </Dialog.Title>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            value={newUserEmail}
                            onChange={(e) => setNewUserEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                            placeholder="admin@example.com"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password *
                          </label>
                          <input
                            type="password"
                            id="password"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                            placeholder="Enter a secure password"
                            required
                            minLength={6}
                          />
                        </div>
                        <div>
                          <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                            Display Name (Optional)
                          </label>
                          <input
                            type="text"
                            id="displayName"
                            value={newUserDisplayName}
                            onChange={(e) => setNewUserDisplayName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
                            placeholder="Admin User"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAddUser}
                      disabled={isAdding || !newUserEmail || !newUserPassword}
                    >
                      {isAdding ? 'Adding...' : 'Add User'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0"
                      onClick={() => {
                        setShowAddModal(false)
                        setNewUserEmail('')
                        setNewUserPassword('')
                        setNewUserDisplayName('')
                        setError(null)
                      }}
                      disabled={isAdding}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Delete Confirmation Modal */}
      <Transition.Root show={showDeleteModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => !isDeleting && setShowDeleteModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Remove Admin Access
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to remove admin access for{' '}
                          <span className="font-medium text-gray-700">
                            {userToDelete?.email} ({userToDelete?.displayName || 'No name'})
                          </span>
                          ? This will revoke their admin privileges but keep their account.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse sm:space-x-reverse sm:space-x-3">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDeleteConfirm(true)}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Removing...' : 'Remove Admin Access'}
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setShowDeleteModal(false)
                        setUserToDelete(null)
                      }}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

