'use client';

import React, { useState, useTransition, useMemo } from 'react';
import Image from 'next/image';
import type { UserWithRole, UserRole } from '@/types/user';

interface UsersTableProps {
  initialUsers: UserWithRole[];
}

interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  displayId: string;
  avatarUrl: string | null;
  role: 'admin' | 'broker' | 'agent' | 'user';
  roleLabel: string;
  status: 'active' | 'away' | 'inactive';
  statusLabel: string;
  propertiesCount: number | string;
  performanceOrLevel: string;
  performanceLabel: string;
  isRealDbUser: boolean;
}

// Sample fallback directory users matching the reference template if DB has only a couple users
// const TEMPLATE_SAMPLE_USERS: DirectoryUser[] = [
//   {
//     id: 'sample-1',
//     name: 'Sarah Miller',
//     email: 'sarah.miller@luxuryestates.com',
//     displayId: 'USR-2941',
//     avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC56qX3A4ZIRCJqxha17327kptmQpANrrIT6CLj09DTQ7ZLjB0fF9cMlC1MCJKAs3hr5oUDilNrCcdzUdLAZtwX25YQblIBzVpUSa4XfyFc_WJDGvW0T1svVr884aNmze31Cl_2UkKik03EROGXyke1i6PuTAZaAtf8yMN8xLPJIAdQ5Gc1m_SqkCpADlwXPZ8fL-BWzj4Ck3PpZ1GjAGsyq9Ul9L3SmH_UnJzI-NbipFCmtQI2JJiB0TiUhogRjIBNn8TCUkubVhs',
//     role: 'broker',
//     roleLabel: 'Senior Broker',
//     status: 'active',
//     statusLabel: 'Active',
//     propertiesCount: 24,
//     performanceOrLevel: '$4.2M',
//     performanceLabel: 'Sales (YTD)',
//     isRealDbUser: false,
//   },
//   {
//     id: 'sample-2',
//     name: 'Marcus Chen',
//     email: 'marcus.c@luxuryestates.com',
//     displayId: 'USR-8821',
//     avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6y5hdg1R7gLFSihyqty_LGTd8uQTZHpyo_det0XoV6ak0U5H9xxuTlfFTXPP3vX9dhpeIETDGBcowSSiDyHVTXQm_0Xv8KXRj-n2PLGHHBlmSsYSxlZPErAGQSycUYUlDT1FNqac9hxwpfwQ3MjO4tdj7q9Pmb8WHgzBaOMain4vzaZbThFi3Hg9-qkhofOnAi7hJ1JD3EgK6Zu5iWLE8NDph0Uhd8iHYZHNUfUzBfJN1E6NRB2EKwbx7MmgWloP-YysiRt4IfrE',
//     role: 'agent',
//     roleLabel: 'Agent',
//     status: 'away',
//     statusLabel: 'Away',
//     propertiesCount: 8,
//     performanceOrLevel: '$1.8M',
//     performanceLabel: 'Sales (YTD)',
//     isRealDbUser: false,
//   },
//   {
//     id: 'sample-3',
//     name: 'Elias Thorne',
//     email: 'elias.thorne@luxuryestates.com',
//     displayId: 'USR-1029',
//     avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxUenMO4Re0naHHGO3GB46gBwyGMA7GYH5XNQVi86xJtOVYUNoL1nn8Q65pwWZkyLQdR_vB2N8mOuxFtLT6blCwOerfNuVqSeqTpdrustLAO7-HYwjC_83sTmfBsuSmMXUPTAZub0b8Tgo2uGzoPZ2i98s_taTX232u4UPVO3NybNwYhzYw8FhvhRPAFvcI-QWnVtQO820Eex8lc8BoMd_fWRl3S6oU4opRnz9HCQOB15l5se_ousKRtbZcFE1JqcjKn1T1PrbGOE',
//     role: 'admin',
//     roleLabel: 'Administrator',
//     status: 'active',
//     statusLabel: 'Active',
//     propertiesCount: '-',
//     performanceOrLevel: 'Level 5',
//     performanceLabel: 'Access Level',
//     isRealDbUser: false,
//   },
//   {
//     id: 'sample-4',
//     name: 'Anna Koval',
//     email: 'anna.k@luxuryestates.com',
//     displayId: 'USR-3310',
//     avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9R6zvnu8j58sG4eUwo-9f00NJRnaHJllOxtW7NfLtjJiAJS9xgpRhQlnDfEULT1ntyQ00kNW93vDfqmwYwX1RCQPYBbvhlrs2VOAtipQyTT3C6te7SH_slUUdDRloL7IVp9QUnB8Ivo76jM9GbGTSedRCNENz2EG_QljoMFfWvhKp0s43vQePPAzlx8RC8KtwYuwd8ToaZVZxa2XoxnstlCppJhDJRvw5Ou981GU62MElNMA1fzr6yjX_QN1QSgdX--GMTBTb22I',
//     role: 'user',
//     roleLabel: 'Viewer',
//     status: 'inactive',
//     statusLabel: 'Inactive',
//     propertiesCount: 0,
//     performanceOrLevel: '2mo ago',
//     performanceLabel: 'Last Login',
//     isRealDbUser: false,
//   },
//   {
//     id: 'sample-5',
//     name: "David O'Conner",
//     email: 'david.o@luxuryestates.com',
//     displayId: 'USR-9942',
//     avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg2jyeiLRo7sss3zX5bvvLWpJNUabZqBCz9HIWx2jcHtvG5KfoaquiQRmwZWTLpD4Rr3jS3iRzWjTa0VLibUkWK_MxV6fzcMISmS1SEsNldZilln2O3A6992ZnLgEiD8ASlQ1cFmc-XvY1X7sK_3pBGUWYHWWutX34hxrAZ-HsCMlmBgatcSpPiTXo4ICkrQ7uSf490A6Bxx60h1ac_QZQl46jo1CciIMS6fFu2O2ZozSmTaFlwiOWhN1vo5n4gXQ0gjh785OlBLQ',
//     role: 'agent',
//     roleLabel: 'Agent',
//     status: 'active',
//     statusLabel: 'Active',
//     propertiesCount: 14,
//     performanceOrLevel: '$3.1M',
//     performanceLabel: 'Sales (YTD)',
//     isRealDbUser: false,
//   },
// ];

export function UsersTable({ initialUsers }: UsersTableProps) {
  const [usersList, setUsersList] = useState<UserWithRole[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'agents' | 'brokers' | 'admins'>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Combine real DB users with template sample users
  const allUsers: DirectoryUser[] = useMemo(() => {
    const dbFormatted: DirectoryUser[] = usersList.map((u, idx) => ({
      id: u.id,
      name: u.display_name || u.email.split('@')[0] || `Usuario ${idx + 1}`,
      email: u.email || 'sin-correo@luxeestate.com',
      displayId: `USR-${u.id.replace(/-/g, '').slice(0, 4).toUpperCase()}`,
      avatarUrl: u.avatar_url,
      role: u.role === 'admin' ? 'admin' : 'user',
      roleLabel: u.role === 'admin' ? 'Administrator' : 'Viewer',
      status: 'active',
      statusLabel: 'Active',
      propertiesCount: u.role === 'admin' ? '-' : 2,
      performanceOrLevel: u.role === 'admin' ? 'Level 5' : 'Verified',
      performanceLabel: u.role === 'admin' ? 'Access Level' : 'Status',
      isRealDbUser: true,
    }));

    // Filter out samples if they clash or merge nicely
    return [...dbFormatted];
  }, [usersList]);

  // Filter based on tab and search
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      // Tab filter
      if (activeTab === 'admins' && u.role !== 'admin') return false;
      if (activeTab === 'agents' && u.role !== 'agent') return false;
      if (activeTab === 'brokers' && u.role !== 'broker') return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.displayId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [allUsers, activeTab, searchQuery]);

  const handleRoleChange = async (userId: string, newRole: UserRole, isReal: boolean) => {
    setOpenDropdownId(null);

    if (!isReal) {
      setFeedbackMessage('Rol actualizado para el usuario de demostración.');
      setTimeout(() => setFeedbackMessage(null), 3000);
      return;
    }

    setUpdatingUserId(userId);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/users/${userId}/role`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: newRole }),
        });

        if (res.ok) {
          setUsersList((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
          );
          setFeedbackMessage(`Rol cambiado exitosamente a "${newRole === 'admin' ? 'Administrador' : 'Usuario'}".`);
          setTimeout(() => setFeedbackMessage(null), 3500);
        } else {
          setFeedbackMessage('Error al actualizar rol en la base de datos.');
          setTimeout(() => setFeedbackMessage(null), 3500);
        }
      } catch {
        setFeedbackMessage('Error de red al actualizar rol.');
        setTimeout(() => setFeedbackMessage(null), 3500);
      } finally {
        setUpdatingUserId(null);
      }
    });
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header Section */}
      <header className="w-full pt-8 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-nordic dark:text-white">
              User Directory
            </h1>
            <p className="text-nordic/60 dark:text-gray-400 mt-1 text-sm">
              Manage user access and roles for your properties.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative group w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-nordic/40 group-focus-within:text-primary text-xl">
                  search
                </span>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email..."
                className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-white dark:bg-gray-800 text-nordic dark:text-white shadow-soft placeholder-nordic/30 focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm outline-none"
              />
            </div>

            {/* Add User Button */}
            <button
              type="button"
              onClick={() => alert('Función para invitar/añadir usuario.')}
              className="inline-flex items-center justify-center px-4 py-2.5 border border-primary text-sm font-medium rounded-lg text-primary bg-transparent hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors whitespace-nowrap cursor-pointer"
            >
              <span className="material-icons text-lg mr-2">add</span>
              Add User
            </button>
          </div>
        </div>

        {/* Status notification if any */}
        {feedbackMessage && (
          <div className="mt-4 p-3 bg-hint-green/40 dark:bg-primary/20 border border-primary/20 rounded-lg text-xs font-medium text-nordic dark:text-hint-green flex items-center gap-2 animate-in fade-in duration-200">
            <span className="material-icons text-base text-primary">check_circle</span>
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Role Tabs */}
        <div className="mt-8 flex gap-6 border-b border-nordic/10 dark:border-gray-700 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`pb-3 text-sm transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'all'
                ? 'font-semibold text-primary dark:text-hint-green border-b-2 border-primary dark:border-hint-green'
                : 'font-medium text-nordic/60 dark:text-gray-400 hover:text-nordic dark:hover:text-white'
              }`}
          >
            All Users
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('agents')}
            className={`pb-3 text-sm transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'agents'
                ? 'font-semibold text-primary dark:text-hint-green border-b-2 border-primary dark:border-hint-green'
                : 'font-medium text-nordic/60 dark:text-gray-400 hover:text-nordic dark:hover:text-white'
              }`}
          >
            Agents
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brokers')}
            className={`pb-3 text-sm transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'brokers'
                ? 'font-semibold text-primary dark:text-hint-green border-b-2 border-primary dark:border-hint-green'
                : 'font-medium text-nordic/60 dark:text-gray-400 hover:text-nordic dark:hover:text-white'
              }`}
          >
            Brokers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('admins')}
            className={`pb-3 text-sm transition-colors cursor-pointer whitespace-nowrap ${activeTab === 'admins'
                ? 'font-semibold text-primary dark:text-hint-green border-b-2 border-primary dark:border-hint-green'
                : 'font-medium text-nordic/60 dark:text-gray-400 hover:text-nordic dark:hover:text-white'
              }`}
          >
            Admins
          </button>
        </div>
      </header>

      {/* Main Directory Table / Cards */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-12 space-y-4">
        {/* Table Column Headers (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 text-xs font-semibold uppercase tracking-wider text-nordic/50 dark:text-gray-400 mb-2">
          <div className="col-span-4">User Details</div>
          <div className="col-span-3">Role &amp; Status</div>
          <div className="col-span-3">Performance</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* Users List Cards */}
        {filteredUsers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center text-nordic/50 dark:text-gray-400">
            No se encontraron usuarios que coincidan con la búsqueda.
          </div>
        ) : (
          filteredUsers.map((u, index) => {
            const isHighlighted = index === 0;
            const isDropdownOpen = openDropdownId === u.id;
            const isCurrentlyUpdating = updatingUserId === u.id;

            return (
              <div
                key={u.id}
                className={`user-card group relative rounded-xl p-5 shadow-sm border transition-all duration-200 flex flex-col md:grid md:grid-cols-12 gap-4 items-center ${isHighlighted
                    ? 'bg-active-green/80 dark:bg-primary/20 border-transparent hover:shadow-soft'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:bg-active-green/50 dark:hover:bg-primary/15 hover:shadow-soft'
                  }`}
                style={{ zIndex: isDropdownOpen ? 30 : 10 - index }}
              >
                {/* Column 1: User Details (col-span-4) */}
                <div className="col-span-12 md:col-span-4 flex items-center w-full">
                  <div className="relative flex-shrink-0">
                    {u.avatarUrl ? (
                      <Image
                        src={u.avatarUrl}
                        alt={u.name}
                        width={48}
                        height={48}
                        className={`h-12 w-12 rounded-full object-cover border-2 ${isHighlighted
                            ? 'border-white dark:border-primary'
                            : 'border-transparent'
                          }`}
                        unoptimized
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-base border-2 border-white dark:border-primary">
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span
                      className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800 ${u.status === 'active'
                          ? 'bg-green-400'
                          : u.status === 'away'
                            ? 'bg-yellow-400'
                            : 'bg-gray-400'
                        }`}
                    ></span>
                  </div>

                  <div className="ml-4 overflow-hidden">
                    <div className="text-sm font-bold text-nordic dark:text-white truncate flex items-center gap-1.5">
                      <span>{u.name}</span>
                      {u.isRealDbUser && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary text-white font-medium">
                          DB
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-nordic/70 dark:text-gray-300 truncate">
                      {u.email}
                    </div>
                    <div className="mt-1 text-[10px] px-2 py-0.5 inline-block bg-white/50 dark:bg-white/10 rounded text-nordic/60 dark:text-gray-400">
                      ID: #{u.displayId}
                    </div>
                  </div>
                </div>

                {/* Column 2: Role & Status (col-span-3) */}
                <div className="col-span-12 md:col-span-3 w-full flex items-center justify-between md:justify-start gap-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${u.role === 'admin'
                        ? 'bg-nordic text-white dark:bg-white dark:text-nordic'
                        : u.role === 'broker'
                          ? 'bg-primary/10 text-primary dark:bg-hint-green/20 dark:text-hint-green'
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                  >
                    {u.roleLabel}
                  </span>

                  <div className="flex items-center text-xs text-nordic/60 dark:text-gray-400">
                    <span
                      className={`material-icons text-[14px] mr-1 ${u.status === 'active'
                          ? 'text-primary'
                          : u.status === 'away'
                            ? 'text-yellow-500'
                            : 'text-gray-400'
                        }`}
                    >
                      {u.status === 'active'
                        ? 'check_circle'
                        : u.status === 'away'
                          ? 'schedule'
                          : 'remove_circle_outline'}
                    </span>
                    {u.statusLabel}
                  </div>
                </div>

                {/* Column 3: Performance (col-span-3) */}
                <div className="col-span-12 md:col-span-3 w-full grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-nordic/50 dark:text-gray-400">
                      Properties
                    </div>
                    <div className="text-sm font-semibold text-nordic dark:text-white">
                      {u.propertiesCount}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-nordic/50 dark:text-gray-400">
                      {u.performanceLabel}
                    </div>
                    <div className="text-sm font-semibold text-nordic dark:text-white">
                      {u.performanceOrLevel}
                    </div>
                  </div>
                </div>

                {/* Column 4: Actions (col-span-2) */}
                <div className="col-span-12 md:col-span-2 w-full flex justify-end relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdownId(isDropdownOpen ? null : u.id)}
                    disabled={isCurrentlyUpdating}
                    className={`inline-flex items-center px-4 py-2 text-xs font-medium rounded-lg transition-colors w-full md:w-auto justify-center cursor-pointer shadow-sm ${isHighlighted
                        ? 'border border-nordic/10 bg-white dark:bg-gray-800 text-nordic dark:text-white hover:bg-nordic hover:text-white'
                        : 'border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-nordic/70 dark:text-gray-300 hover:border-nordic hover:text-nordic dark:hover:text-white'
                      }`}
                  >
                    {isCurrentlyUpdating ? 'Updating...' : 'Change Role'}
                    <span className="material-icons text-[16px] ml-2">
                      {isDropdownOpen ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 rounded-lg shadow-dropdown bg-primary text-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden z-50 origin-top-right animate-in fade-in zoom-in-95 duration-150">
                      <div className="py-1" role="menu">
                        <button
                          type="button"
                          onClick={() => handleRoleChange(u.id, 'admin', u.isRealDbUser)}
                          className="w-full text-left group flex items-center px-4 py-3 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="material-icons text-sm mr-3 text-white/60 group-hover:text-white">
                            shield
                          </span>
                          Administrator
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRoleChange(u.id, 'user', u.isRealDbUser)}
                          className="w-full text-left group flex items-center px-4 py-3 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="material-icons text-sm mr-3 text-white/60 group-hover:text-white">
                            business_center
                          </span>
                          Broker
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRoleChange(u.id, 'user', u.isRealDbUser)}
                          className="w-full text-left group flex items-center px-4 py-3 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="material-icons text-sm mr-3 text-white/60 group-hover:text-white">
                            support_agent
                          </span>
                          Agent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRoleChange(u.id, 'user', u.isRealDbUser)}
                          className="w-full text-left group flex items-center px-4 py-3 text-xs text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                        >
                          <span className="material-icons text-sm mr-3 text-white/60 group-hover:text-white">
                            visibility
                          </span>
                          Viewer
                        </button>

                        <div className="border-t border-white/10 my-1"></div>

                        <button
                          type="button"
                          onClick={() => {
                            setOpenDropdownId(null);
                            alert(`Suspender usuario ${u.name}`);
                          }}
                          className="w-full text-left group flex items-center px-4 py-3 text-xs text-red-200 hover:bg-red-500/20 hover:text-red-100 transition-colors cursor-pointer"
                        >
                          <span className="material-icons text-sm mr-3 text-red-300 group-hover:text-red-100">
                            block
                          </span>
                          Suspend User
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Footer Pagination Section */}
      <footer className="mt-auto border-t border-nordic/5 dark:border-gray-700 bg-background-light dark:bg-background-dark py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-nordic/60 dark:text-gray-400">
                Showing{' '}
                <span className="font-medium text-nordic dark:text-white">1</span> to{' '}
                <span className="font-medium text-nordic dark:text-white">
                  {filteredUsers.length}
                </span>{' '}
                of{' '}
                <span className="font-medium text-nordic dark:text-white">
                  {filteredUsers.length}
                </span>{' '}
                users
              </p>
            </div>

            <div>
              <nav
                aria-label="Pagination"
                className="relative z-0 inline-flex rounded-md shadow-none -space-x-px"
              >
                <button
                  type="button"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md text-sm font-medium text-nordic/50 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="sr-only">Previous</span>
                  <span className="material-icons text-xl">chevron_left</span>
                </button>
                <button
                  type="button"
                  aria-current="page"
                  className="z-10 bg-primary text-white relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 shadow-sm cursor-pointer"
                >
                  1
                </button>
                <button
                  type="button"
                  className="bg-transparent text-nordic/70 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-primary relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 transition-colors cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  className="bg-transparent text-nordic/70 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-primary relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 transition-colors cursor-pointer"
                >
                  3
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-nordic/40 dark:text-gray-500">
                  ...
                </span>
                <button
                  type="button"
                  className="bg-transparent text-nordic/70 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-primary relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md mx-1 transition-colors cursor-pointer"
                >
                  8
                </button>
                <button
                  type="button"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md text-sm font-medium text-nordic/50 hover:text-primary transition-colors cursor-pointer"
                >
                  <span className="sr-only">Next</span>
                  <span className="material-icons text-xl">chevron_right</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Mobile pagination */}
          <div className="flex items-center justify-between w-full sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-nordic bg-white border border-gray-300 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              type="button"
              className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-nordic bg-white border border-gray-300 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
