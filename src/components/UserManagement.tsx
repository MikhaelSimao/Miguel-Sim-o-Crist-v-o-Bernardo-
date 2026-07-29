/**
 * @file src/components/UserManagement.tsx
 * @description Módulo de Gestão de Usuários e Controle de Acesso Baseado em Níveis (RBAC)
 */

import React, { useState } from 'react';
import { Users, UserPlus, Shield, Check, X, ShieldAlert, Edit, Trash2, Key, CheckCircle2 } from 'lucide-react';
import { User, UserRole, Language } from '../types';
import { getUsers, saveUsers } from '../services/storage';
import { getTranslation } from '../data/translations';

interface UserManagementProps {
  currentLang: Language;
  currentUser: User;
}

export const UserManagement: React.FC<UserManagementProps> = ({ currentLang, currentUser }) => {
  const [usersList, setUsersList] = useState<User[]>(getUsers());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Se o utilizador atual não for Admin, mostra mensagem de acesso restrito
  if (currentUser.role !== 'admin') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
        <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-base font-bold text-white">
          {getTranslation(currentLang, 'permissionDenied')}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          O módulo de Gerir Usuários é reservado exclusivamente para Administradores do Governo Provincial e Proteção Civil.
        </p>
      </div>
    );
  }

  // Alternar Estado Ativo / Inativo
  const handleToggleUserStatus = (userId: string) => {
    const updated = usersList.map((u) =>
      u.id === userId ? { ...u, active: !u.active } : u
    );
    setUsersList(updated);
    saveUsers(updated);
  };

  // Alterar Papel / Nível do Usuário
  const handleChangeUserRole = (userId: string, newRole: UserRole) => {
    const updated = usersList.map((u) =>
      u.id === userId ? { ...u, role: newRole } : u
    );
    setUsersList(updated);
    saveUsers(updated);
  };

  // Guardar Novo ou Editado Usuário
  const handleSaveUser = (user: User) => {
    let updated: User[];
    if (editingUser) {
      updated = usersList.map((u) => (u.id === user.id ? user : u));
    } else {
      updated = [user, ...usersList];
    }
    setUsersList(updated);
    saveUsers(updated);
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Gestão de Usuários e Níveis de Acesso
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gerencie os acessos do pessoal da Proteção Civil, Técnicos de Campo e Cidadãos do Bairro Mubungo
          </p>
        </div>

        <button
          onClick={() => {
            setEditingUser(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" />
          Registar Novo Usuário
        </button>
      </div>

      {/* Tabela de Usuários Registados */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Nome & Correio Eletrónico</th>
                <th className="py-3 px-4">Telefone SMS</th>
                <th className="py-3 px-4">Nível de Acesso (Papel)</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Alterar Nível</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-white">{u.name}</div>
                    <div className="text-[11px] text-slate-400">{u.email}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">{u.phone}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border ${
                      u.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' :
                      u.role === 'tecnico' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                      u.role === 'protecao_civil' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                      'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {u.role === 'admin' && 'Administrador'}
                      {u.role === 'tecnico' && 'Técnico de Campo'}
                      {u.role === 'protecao_civil' && 'Proteção Civil'}
                      {u.role === 'cidadao' && 'Morador Mubungo'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleUserStatus(u.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                        u.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {u.active ? 'Ativo' : 'Bloqueado'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={u.role}
                      onChange={(e) => handleChangeUserRole(u.id, e.target.value as UserRole)}
                      className="bg-slate-800 text-xs text-white border border-slate-700 rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
                    >
                      <option value="cidadao">Cidadão</option>
                      <option value="tecnico">Técnico</option>
                      <option value="protecao_civil">Proteção Civil</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matriz Informativa de Permissões por Nível de Usuário */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
          <Shield className="w-4 h-4 text-blue-400" />
          Matriz de Permissões de Acesso por Nível
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 space-y-1">
            <span className="font-bold text-purple-300 block">1. Administrador</span>
            <p className="text-[11px] text-slate-400">Acesso total a todos os módulos, gestão de usuários, calibração de sensores e emissão de boletins.</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 space-y-1">
            <span className="font-bold text-blue-300 block">2. Técnico de Campo</span>
            <p className="text-[11px] text-slate-400">Configuração de placas ESP32/Arduino, diagnóstico de telemetria e emissão de relatórios.</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 space-y-1">
            <span className="font-bold text-amber-300 block">3. Proteção Civil</span>
            <p className="text-[11px] text-slate-400">Publicação de boletins de emergência, envio de SMS em massa e coordenação de evacuação no mapa.</p>
          </div>
          <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700 space-y-1">
            <span className="font-bold text-emerald-300 block">4. Cidadão / Morador</span>
            <p className="text-[11px] text-slate-400">Consulta de níveis de água, mapas de rota de fuga, leitura de boletins e denúncias comunitárias.</p>
          </div>
        </div>
      </div>

      {/* MODAL ADICIONAR / EDITAR USUÁRIO */}
      {isModalOpen && (
        <UserModalForm
          user={editingUser}
          onSave={handleSaveUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

// SUBCOMPONENTE FORMULÁRIO DE USUÁRIO
const UserModalForm: React.FC<{
  user: User | null;
  onSave: (u: User) => void;
  onClose: () => void;
}> = ({ user, onSave, onClose }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+244 ');
  const [role, setRole] = useState<UserRole>(user?.role || 'cidadao');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: user?.id || `usr-${Date.now()}`,
      name,
      email,
      phone,
      role,
      active: true,
      createdAt: user?.createdAt || new Date().toISOString().split('T')[0],
      location: 'Bairro Mubungo, Bengo',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-white space-y-4">
        <h3 className="font-bold text-base">Registar Novo Usuário do Sistema</h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nome Completo</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Telefone (SMS)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nível de Permissão</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white cursor-pointer"
            >
              <option value="cidadao">Cidadão / Morador</option>
              <option value="tecnico">Técnico de Campo</option>
              <option value="protecao_civil">Proteção Civil</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow"
            >
              Guardar Usuário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
