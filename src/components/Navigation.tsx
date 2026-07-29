/**
 * @file src/components/Navigation.tsx
 * @description Barra de Navegação dos Módulos do Sistema de Alerta com Indicador de Permissões
 */

import React from 'react';
import { LayoutDashboard, Waves, Cpu, FileText, FileBarChart, Users, MapPin, MessageSquareWarning } from 'lucide-react';
import { User, Language } from '../types';
import { getTranslation } from '../data/translations';

export type ActiveTab = 'dashboard' | 'water_levels' | 'sensors' | 'bulletins' | 'reports' | 'map' | 'users' | 'support';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  currentUser: User;
  currentLang: Language;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  currentUser,
  currentLang,
}) => {
  // Lista de Módulos com ícone e restrição por papel
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: getTranslation(currentLang, 'modDashboard'),
      icon: LayoutDashboard,
      allowedRoles: ['admin', 'tecnico', 'protecao_civil', 'cidadao'],
    },
    {
      id: 'water_levels' as ActiveTab,
      label: getTranslation(currentLang, 'modWaterLevels'),
      icon: Waves,
      allowedRoles: ['admin', 'tecnico', 'protecao_civil', 'cidadao'],
    },
    {
      id: 'map' as ActiveTab,
      label: getTranslation(currentLang, 'modMap'),
      icon: MapPin,
      allowedRoles: ['admin', 'tecnico', 'protecao_civil', 'cidadao'],
    },
    {
      id: 'sensors' as ActiveTab,
      label: getTranslation(currentLang, 'modSensors'),
      icon: Cpu,
      allowedRoles: ['admin', 'tecnico'],
      badge: 'Arduino/ESP32',
    },
    {
      id: 'bulletins' as ActiveTab,
      label: getTranslation(currentLang, 'modBulletins'),
      icon: FileText,
      allowedRoles: ['admin', 'tecnico', 'protecao_civil', 'cidadao'],
    },
    {
      id: 'reports' as ActiveTab,
      label: getTranslation(currentLang, 'modReports'),
      icon: FileBarChart,
      allowedRoles: ['admin', 'tecnico', 'protecao_civil'],
    },
    {
      id: 'support' as ActiveTab,
      label: getTranslation(currentLang, 'modSupport'),
      icon: MessageSquareWarning,
      allowedRoles: ['admin', 'tecnico', 'protecao_civil', 'cidadao'],
    },
    {
      id: 'users' as ActiveTab,
      label: getTranslation(currentLang, 'modUsers'),
      icon: Users,
      allowedRoles: ['admin'],
      badge: 'Admin',
    },
  ];

  return (
    <nav className="bg-slate-900/95 dark:bg-slate-900 border-b border-slate-800 backdrop-blur-md sticky top-[65px] z-30 overflow-x-auto no-scrollbar shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 sm:gap-2 py-2 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isAllowed = item.allowedRoles.includes(currentUser.role);

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : isAllowed
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  : 'text-slate-500 hover:text-slate-400 hover:bg-slate-800/30 opacity-75'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>

              {/* Distintivo Informativo (Ex: ESP32 ou Admin) */}
              {item.badge && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                    isActive
                      ? 'bg-blue-800 text-blue-100'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Indicador de Restrição se não for permitido para o utilizador atual */}
              {!isAllowed && (
                <span className="text-[10px] text-amber-500 font-normal ml-0.5">
                  (Restrito)
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
