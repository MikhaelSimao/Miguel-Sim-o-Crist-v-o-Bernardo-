/**
 * @file src/components/Header.tsx
 * @description Cabeçalho Principal do Sistema com Troca de Idioma (PT, Kimbundo, EN) e Tema (Claro/Escuro)
 */

import React from 'react';
import { ShieldAlert, Sun, Moon, Globe, User as UserIcon, LogOut, KeyRound } from 'lucide-react';
import { User, Language, ThemeMode } from '../types';
import { getTranslation } from '../data/translations';

interface HeaderProps {
  currentUser: User;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  currentTheme: ThemeMode;
  onThemeToggle: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  currentLang,
  onLanguageChange,
  currentTheme,
  onThemeToggle,
  onOpenAuthModal,
  onLogout,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      {/* Banner Superior de Alerta Urgente em Kimbundo e Português */}
      <div className="bg-amber-600 text-slate-950 px-4 py-1.5 text-xs md:text-sm font-medium flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 animate-pulse truncate">
          <ShieldAlert className="w-4 h-4 text-slate-950 shrink-0" />
          <span className="font-bold uppercase tracking-wider">
            {getTranslation(currentLang, 'kimbundoWelcome')}
          </span>
          <span className="hidden sm:inline opacity-80">
            • {getTranslation(currentLang, 'emergencyPhone')}
          </span>
        </div>
        <div className="shrink-0 font-semibold text-[11px] bg-slate-950/20 px-2 py-0.5 rounded">
          {getTranslation(currentLang, 'provinceName')}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logótipo do Sistema e Título */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg leading-tight tracking-tight text-white">
                {getTranslation(currentLang, 'appName')}
              </h1>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-400/30">
                v2.4 Bengo
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {getTranslation(currentLang, 'appFullName')}
            </p>
          </div>
        </div>

        {/* Controlos de Idioma, Tema e Perfil do Utilizador */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Seletor de Língua Nacional (Kimbundo) e Português / Inglês */}
          <div className="relative flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1 hidden sm:block" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs font-medium text-slate-200 pr-2 py-1 focus:outline-none cursor-pointer"
              aria-label="Selecionar Idioma"
            >
              <option value="pt" className="bg-slate-900 text-white">
                🇦🇴 Português (PT)
              </option>
              <option value="kmb" className="bg-slate-900 text-amber-300">
                🇦🇴 Kimbundo (KMB)
              </option>
              <option value="en" className="bg-slate-900 text-white">
                🇬🇧 English (EN)
              </option>
            </select>
          </div>

          {/* Botão de Alternância de Tema (Claro / Escuro) */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Mudar Tema (Claro / Escuro)"
            aria-label="Alternar Tema"
          >
            {currentTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-300" />
            )}
          </button>

          {/* Cartão de Identificação do Utilizador / Botão Login */}
          <div className="pl-2 border-l border-slate-800 flex items-center gap-2">
            <div className="text-right hidden md:block">
              <div className="text-xs font-semibold text-white leading-snug">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-blue-400 font-medium capitalize">
                {currentUser.role === 'admin' && 'Administrador'}
                {currentUser.role === 'tecnico' && 'Técnico de Campo'}
                {currentUser.role === 'protecao_civil' && 'Proteção Civil'}
                {currentUser.role === 'cidadao' && 'Morador do Mubungo'}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-2 rounded-lg transition-all shadow-sm"
                title="Sessão / Trocar Conta"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{currentUser ? 'Conta' : 'Entrar'}</span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
                title="Sair do Sistema"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
