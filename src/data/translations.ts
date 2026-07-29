/**
 * @file src/data/translations.ts
 * @description Dicionário de Tradução Multilíngua (Português, Kimbundo e Inglês)
 * 
 * O Kimbundo é uma língua nacional falada na Província do Bengo (Caxito e Bairro Mubungo).
 * Este ficheiro provê suporte de acessibilidade linguística para os moradores locais e autoridades.
 */

import { Language } from '../types';

export const translations = {
  pt: {
    // Cabeçalho e Navegação
    appName: "SABM - Bengo",
    appFullName: "Sistema de Alerta de Inundação do Mubungo",
    provinceName: "Província do Bengo - Bairro Mubungo",
    rioDande: "Bacia do Rio Dande e Vala do Mubungo",
    
    // Módulos
    modDashboard: "Painel Inicial",
    modWaterLevels: "Níveis de Água",
    modSensors: "Configurar Sensores",
    modBulletins: "Buscar & Criar Boletins",
    modReports: "Emitir & Pesquisar Relatórios",
    modUsers: "Gerir Usuários",
    modMap: "Mapa de Risco & Fuga",
    modSupport: "Mensagens & Suporte",
    
    // Status e Níveis de Alerta
    statusNormal: "Normal",
    statusWarning: "Atenção",
    statusAlert: "Alerta",
    statusEmergency: "Emergência",
    
    // Dashboard & Indicadores
    currentWaterLevel: "Nível Atual da Água",
    flowRate: "Caudal Estabilizado",
    rainfall: "Precipitação (Chuva)",
    activeSensors: "Sensores Ativos",
    lastSensorRead: "Última Leitura",
    riskLevel: "Nível de Risco Atual",
    simulatedLevelControl: "Simulador de Leitura do Sensor",
    triggerSimulatedAlert: "Testar Alerta de Emergência",
    
    // Hardware Arduino e ESP32
    hardwareSectionTitle: "Configuração e Integração de Sensores Hardware",
    hardwareSubtitle: "Conecte microcontroladores Arduino Uno e ESP32 para telemetria em tempo real no Bairro Mubungo",
    esp32Guide: "ESP32 (Wi-Fi / HTTP POST)",
    arduinoGuide: "Arduino Uno (Serial / HC-SR04 Ultrassónico)",
    generateCode: "Gerar Código C++ (Firmware)",
    copyCode: "Copiar Código",
    codeCopied: "Código copiado para a área de transferência!",
    testHardwareConnection: "Testar Conexão com Placa",
    simulatedPayload: "Envio de Pacote JSON de Teste",
    
    // Autenticação & Usuários
    login: "Entrar no Sistema",
    register: "Criar Nova Conta",
    recoverPassword: "Recuperar Senha",
    logout: "Sair",
    userRoleAdmin: "Administrador do Sistema",
    userRoleTech: "Técnico de Campo",
    userRoleCivilProtection: "Proteção Civil / Autoridade",
    userRoleCitizen: "Cidadão / Morador",
    permissionDenied: "Acesso Restrito: O seu perfil não tem permissão para aceder a este módulo.",

    // Formulários e Ações
    searchPlaceholder: "Pesquisar registos...",
    filterBySeverity: "Filtrar por Severidade",
    createNewBulletin: "Publicar Novo Boletim",
    createNewReport: "Emitir Novo Relatório",
    printReport: "Imprimir Relatório",
    exportData: "Exportar Dados",
    saveChanges: "Guardar Alterações",
    cancel: "Cancelar",
    
    // Kimbundo Welcome Banner
    kimbundoWelcome: "Kiambote! Sistema de Proteção Contra Inundações no Bengo.",
    
    // Contactos e Suporte
    emergencyPhone: "Linha Direta da Proteção Civil do Bengo: 113 / 923 000 112",
    bomberosPhone: "Bombeiros do Bengo: 115",
    policePhone: "Polícia Provincial do Bengo: 113",
    hospitalPhone: "Hospital Geral de Caxito: 924 111 222",
  },

  kmb: {
    // Cabeçalho e Navegação em Kimbundo
    appName: "SABM - Bengo",
    appFullName: "Kukunda ku Maza Pela ku Mubungo",
    provinceName: "Mbanza Bengo - Kubata ku Mubungo",
    rioDande: "Ngiji Dande ni Muka wa Mubungo",
    
    // Módulos em Kimbundo
    modDashboard: "Meza Inene (Painel)",
    modWaterLevels: "Kula kwa Maza",
    modSensors: "Kulonga Makina (Sensores)",
    modBulletins: "Lusangu lwa Maza",
    modReports: "Mikanda Yoso (Relatórios)",
    modUsers: "Kunda Athu (Usuários)",
    modMap: "Lualu lwa Kididi (Mapa)",
    modSupport: "Nzumbi ni Kukuata",
    
    // Status e Níveis de Alerta
    statusNormal: "Maza Yambote (Normal)",
    statusWarning: "Kutundisa Disu (Atenção)",
    statusAlert: "Maza Malamba (Alerta)",
    statusEmergency: "Lumbote Pela! Katuka (Emergência)",
    
    // Dashboard & Indicadores
    currentWaterLevel: "Kula kwoso kwa Maza Lelu",
    flowRate: "Nvula Inene",
    rainfall: "Nvula Okutoka",
    activeSensors: "Makina Yala Ni Omuenho",
    lastSensorRead: "Utena wa Sukina",
    riskLevel: "Bela ya Maza",
    simulatedLevelControl: "Kusola Maza Pela",
    triggerSimulatedAlert: "Maza Pela Pela!",
    
    // Hardware Arduino e ESP32
    hardwareSectionTitle: "Kuta Makina Arduino ni ESP32",
    hardwareSubtitle: "Kuta makina mumatunda ma Mubungo phala kuxiba maza",
    esp32Guide: "ESP32 (Wi-Fi POST)",
    arduinoGuide: "Arduino Uno (Ultrassónico)",
    generateCode: "Gera Código C++",
    copyCode: "Londa Código",
    codeCopied: "Código okusola!",
    testHardwareConnection: "Fieta Makina",
    simulatedPayload: "Pakote ya Teste",
    
    // Autenticação & Usuários
    login: "Bota Mu Muenho",
    register: "Soneka Dijina",
    recoverPassword: "Sula Senha",
    logout: "Tunda",
    userRoleAdmin: "Kapa Inene (Admin)",
    userRoleTech: "Muntu wa Makina (Técnico)",
    userRoleCivilProtection: "Proteção Civil",
    userRoleCitizen: "Morador ku Mubungo",
    permissionDenied: "Kana Kuxiba: Ngeji yakatuka mu kibuku kyaki.",

    // Formulários e Ações
    searchPlaceholder: "Sonda mu mikanda...",
    filterBySeverity: "Sola Mu Bela",
    createNewBulletin: "Soneka Lusangu Lwakala",
    createNewReport: "Soneka Mukanda Woso",
    printReport: "Suma Mukanda (Imprimir)",
    exportData: "Kuta Mikanda",
    saveChanges: "Sika Yawe",
    cancel: "Suka",
    
    // Kimbundo Welcome Banner
    kimbundoWelcome: "Mbote wiza! Kukunda ku maza pela mu Bengo, Mubungo.",
    
    // Contactos e Suporte
    emergencyPhone: "Proteção Civil Bengo: 113 / 923 000 112",
    bomberosPhone: "Bombeiros Bengo: 115",
    policePhone: "Polícia Bengo: 113",
    hospitalPhone: "Hospital Caxito: 924 111 222",
  },

  en: {
    // Header & Navigation
    appName: "SABM - Bengo",
    appFullName: "Mubungo Flood Early Warning System",
    provinceName: "Bengo Province - Mubungo Neighborhood",
    rioDande: "Dande River Basin & Mubungo Stream",
    
    // Modules
    modDashboard: "Dashboard",
    modWaterLevels: "Water Levels",
    modSensors: "Configure Sensors",
    modBulletins: "Search & Create Bulletins",
    modReports: "Issue & Search Reports",
    modUsers: "User Management",
    modMap: "Risk & Evacuation Map",
    modSupport: "Messages & Support",
    
    // Status & Alert Levels
    statusNormal: "Normal",
    statusWarning: "Warning",
    statusAlert: "Alert",
    statusEmergency: "Emergency",
    
    // Dashboard & Metrics
    currentWaterLevel: "Current Water Level",
    flowRate: "Flow Rate",
    rainfall: "Rainfall",
    activeSensors: "Active Sensors",
    lastSensorRead: "Last Reading",
    riskLevel: "Current Risk Level",
    simulatedLevelControl: "Sensor Telemetry Simulator",
    triggerSimulatedAlert: "Trigger Emergency Test",
    
    // Arduino & ESP32 Hardware
    hardwareSectionTitle: "Hardware Sensors Configuration & Integration",
    hardwareSubtitle: "Connect Arduino Uno and ESP32 microcontrollers for real-time telemetry in Mubungo",
    esp32Guide: "ESP32 (Wi-Fi / HTTP POST)",
    arduinoGuide: "Arduino Uno (Serial / HC-SR04 Ultrasonic)",
    generateCode: "Generate C++ Code (Firmware)",
    copyCode: "Copy Code",
    codeCopied: "Code copied to clipboard!",
    testHardwareConnection: "Test Hardware Connection",
    simulatedPayload: "Send Test JSON Payload",
    
    // Auth & Users
    login: "Sign In",
    register: "Create Account",
    recoverPassword: "Recover Password",
    logout: "Sign Out",
    userRoleAdmin: "System Administrator",
    userRoleTech: "Field Technician",
    userRoleCivilProtection: "Civil Protection Officer",
    userRoleCitizen: "Mubungo Resident",
    permissionDenied: "Access Denied: Your account role does not have permission to view this module.",

    // Forms & Actions
    searchPlaceholder: "Search records...",
    filterBySeverity: "Filter by Severity",
    createNewBulletin: "Create New Bulletin",
    createNewReport: "Issue New Report",
    printReport: "Print Report",
    exportData: "Export Data",
    saveChanges: "Save Changes",
    cancel: "Cancel",
    
    // Kimbundo Welcome Banner
    kimbundoWelcome: "Welcome! Flood Warning & Civil Protection System in Bengo.",
    
    // Contacts & Support
    emergencyPhone: "Bengo Civil Protection Hotline: 113 / 923 000 112",
    bomberosPhone: "Bengo Fire Department: 115",
    policePhone: "Bengo Provincial Police: 113",
    hospitalPhone: "Caxito General Hospital: 924 111 222",
  }
};

/**
 * Helper para obter texto traduzido conforme o idioma selecionado
 * @param lang Idioma atual ('pt', 'kmb', 'en')
 * @param key Chave de tradução
 */
export function getTranslation(lang: Language, key: keyof typeof translations['pt']): string {
  const dictionary = translations[lang] || translations.pt;
  return dictionary[key] || translations.pt[key] || key;
}
