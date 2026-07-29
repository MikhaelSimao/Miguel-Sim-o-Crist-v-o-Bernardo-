/**
 * @file src/components/AuthModal.tsx
 * @description Modal de Autenticação, Criação de Conta, Recuperação de Senha e Troca de Perfil
 */

import React, { useState } from 'react';
import { X, UserCheck, Key, UserPlus, ShieldAlert, CheckCircle2, RefreshCw } from 'lucide-react';
import { User, UserRole, Language } from '../types';
import { getUsers, saveUsers, setCurrentUser } from '../services/storage';
import { getTranslation } from '../data/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUserChanged: (user: User) => void;
  currentLang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  currentLang,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'recover'>('login');
  
  // Estados para Login
  const [loginEmail, setLoginEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('cidadao');

  // Estados para Criar Conta
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('cidadao');

  // Estados para Recuperar Senha
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverMessage, setRecoverMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Lista de utilizadores registados no sistema LocalStorage
  const registeredUsers = getUsers();

  // Troca rápida de utilizador de demonstração
  const handleSelectQuickUser = (user: User) => {
    setCurrentUser(user);
    onUserChanged(user);
    onClose();
  };

  // Submissão do Formulário de Registo (Criar Conta)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: regName,
      email: regEmail,
      phone: regPhone || '+244 920 000 000',
      role: regRole,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      location: 'Bairro Mubungo, Caxito',
    };

    const currentList = getUsers();
    saveUsers([newUser, ...currentList]);
    setCurrentUser(newUser);
    onUserChanged(newUser);
    onClose();
  };

  // Submissão de Recuperação de Senha
  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoverEmail) return;
    setRecoverMessage(`Enviámos as instruções de reposição e código de verificação SMS para o contacto associado a: ${recoverEmail}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl text-white">
        {/* Cabeçalho do Modal */}
        <div className="bg-slate-800/80 px-6 py-4 flex items-center justify-between border-b border-slate-700/80">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-400" />
            <h2 className="font-bold text-base text-white">
              Acesso ao Sistema de Alerta do Bengo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Separadores (Login / Criar Conta / Recuperar) */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {getTranslation(currentLang, 'login')}
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {getTranslation(currentLang, 'register')}
          </button>
          <button
            onClick={() => setActiveTab('recover')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'recover'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {getTranslation(currentLang, 'recoverPassword')}
          </button>
        </div>

        <div className="p-6">
          {/* ABA: LOGIN E SELEÇÃO RÁPIDA DE PERFIL */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Selecione um utilizador de teste para simular as permissões de acesso por nível no Bairro Mubungo:
              </p>

              <div className="space-y-2">
                {registeredUsers.map((u) => {
                  const isCurrent = currentUser.id === u.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleSelectQuickUser(u)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center font-bold text-xs text-blue-300">
                          {u.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                            {u.name}
                            {isCurrent && (
                              <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                                Ativo
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {u.email} • <span className="text-blue-400 uppercase font-bold">{u.role}</span>
                          </div>
                        </div>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ABA: CRIAR NOVA CONTA */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ex: Manuel Domingos Mubungo"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Endereço de Correio Eletrónico (E-mail)
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="seu.nome@bengo.gov.ao"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contacto Telefónico (Para SMS de Emergência)
                </label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+244 923 000 000"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nível de Acesso no Sistema
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="cidadao">Cidadão / Morador do Bairro Mubungo</option>
                  <option value="protecao_civil">Proteção Civil / Bombeiros</option>
                  <option value="tecnico">Técnico de Campo (Hardware/Sensores)</option>
                  <option value="admin">Administrador do Governo Provincial</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <UserPlus className="w-4 h-4" />
                Criar Conta e Aceder
              </button>
            </form>
          )}

          {/* ABA: RECUPERAR SENHA / CONTA */}
          {activeTab === 'recover' && (
            <form onSubmit={handleRecoverSubmit} className="space-y-4">
              <p className="text-xs text-slate-400">
                Insira o seu e-mail ou telefone registado para redefinir a sua senha de acesso ao sistema de alerta.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  E-mail ou Nº de Telefone Registado
                </label>
                <input
                  type="text"
                  required
                  value={recoverEmail}
                  onChange={(e) => setRecoverEmail(e.target.value)}
                  placeholder="exemplo@bengo.gov.ao ou +244..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {recoverMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{recoverMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Enviar Instruções de Recuperação
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
