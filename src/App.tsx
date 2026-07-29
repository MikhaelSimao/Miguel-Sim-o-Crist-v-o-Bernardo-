/**
 * @file src/App.tsx
 * @description Aplicação Principal do Sistema de Alerta de Inundação na Província do Bengo (Bairro Mubungo)
 * 
 * Este ficheiro integra todos os módulos requeridos:
 * 1. Gerir Usuários (RBAC)
 * 2. Painel Inicial e Medição de Níveis de Água em Tempo Real
 * 3. Configurar Sensores Hardware (Arduino Uno e ESP32)
 * 4. Buscar e Criar Boletins Hidrometeorológicos
 * 5. Emitir e Pesquisar Relatórios com Impressão PDF
 * 6. Opção para Mudar o Tema (Claro / Escuro) com LocalStorage
 * 7. Opção de Trocar a Língua (Português / Kimbundo / Inglês)
 * 8. Mensagens, SMS de Emergência e Suporte
 * 9. API de Mapas Interativos (Leaflet)
 * 10. Autenticação: Criar Conta, Recuperar Senhas, Seleção de Perfil
 */

import React, { useState, useEffect } from 'react';
import { User, Language, ThemeMode } from './types';
import {
  initLocalStorage,
  getCurrentUser,
  setCurrentUser,
  getLanguage,
  setLanguage as saveLanguage,
  getTheme,
  setTheme as saveTheme,
} from './services/storage';

// Importação dos Componentes
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { MapView } from './components/MapView';
import { SensorManager } from './components/SensorManager';
import { BulletinsModule } from './components/BulletinsModule';
import { ReportsModule } from './components/ReportsModule';
import { UserManagement } from './components/UserManagement';
import { MessagesSupport } from './components/MessagesSupport';

export default function App() {
  // Inicialização do LocalStorage do Bengo
  useEffect(() => {
    initLocalStorage();
  }, []);

  // Estados Globais do Sistema
  const [currentUser, setCurrentUserAppState] = useState<User>(getCurrentUser());
  const [currentLang, setCurrentLang] = useState<Language>(getLanguage());
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(getTheme());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Aplicação do Tema (Claro / Escuro) na tag HTML do navegador
  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  // Alternador de Tema (Claro / Escuro)
  const handleThemeToggle = () => {
    const newTheme: ThemeMode = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    saveTheme(newTheme);
  };

  // Alternador de Idioma (Português, Kimbundo, Inglês)
  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    saveLanguage(lang);
  };

  // Atualizador de Utilizador Registado / Sessão
  const handleUserChanged = (user: User) => {
    setCurrentUserAppState(user);
    setCurrentUser(user);
  };

  // Sair do Sistema
  const handleLogout = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      currentTheme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. Cabeçalho Principal com Seletor de Língua, Tema e Perfil */}
      <Header
        currentUser={currentUser}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        currentTheme={currentTheme}
        onThemeToggle={handleThemeToggle}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 2. Barra de Navegação Módulos */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentUser={currentUser}
        currentLang={currentLang}
      />

      {/* 3. Área Principal do Módulo Ativo */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* MÓDULO: PAINEL INICIAL & NÍVEIS DE ÁGUA */}
        {(activeTab === 'dashboard' || activeTab === 'water_levels') && (
          <Dashboard
            currentLang={currentLang}
            currentUser={currentUser}
            onNavigateToTab={setActiveTab}
          />
        )}

        {/* MÓDULO: API DE MAPAS DE RISCO & FUGA */}
        {activeTab === 'map' && (
          <MapView currentLang={currentLang} />
        )}

        {/* MÓDULO: CONFIGURAR SENSORES HARDWARE (ARDUINO UNO E ESP32) */}
        {activeTab === 'sensors' && (
          <SensorManager
            currentLang={currentLang}
            currentUser={currentUser}
          />
        )}

        {/* MÓDULO: BUSCAR & CRIAR BOLETIMS */}
        {activeTab === 'bulletins' && (
          <BulletinsModule
            currentLang={currentLang}
            currentUser={currentUser}
          />
        )}

        {/* MÓDULO: EMITIR & PESQUISAR RELATÓRIOS (COM IMPRESSÃO) */}
        {activeTab === 'reports' && (
          <ReportsModule
            currentLang={currentLang}
            currentUser={currentUser}
          />
        )}

        {/* MÓDULO: GERIR USUÁRIOS (ADMIN) */}
        {activeTab === 'users' && (
          <UserManagement
            currentLang={currentLang}
            currentUser={currentUser}
          />
        )}

        {/* MÓDULO: MENSAGENS, DIFUSÃO SMS & SUPORTE */}
        {activeTab === 'support' && (
          <MessagesSupport
            currentLang={currentLang}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Rodapé da Aplicação */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-300">
            Governo Provincial do Bengo • Comando da Proteção Civil e Bombeiros do Dande
          </p>
          <p>
            Sistema de Monitoramento e Alerta do Bairro Mubungo (SABM) — Suporte a Hardware ESP32 / Arduino Uno
          </p>
        </div>
      </footer>

      {/* Modal de Autenticação, Criação de Conta e Recuperação de Senha */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onUserChanged={handleUserChanged}
        currentLang={currentLang}
      />
    </div>
  );
}
