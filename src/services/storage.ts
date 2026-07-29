/**
 * @file src/services/storage.ts
 * @description Gestão de Persistência em LocalStorage e Dados Iniciais para o Bengo / Mubungo
 * 
 * Este módulo armazena e recupera dados localmente no navegador (LocalStorage)
 * garantindo o funcionamento offline do sistema mesmo em situações de corte de energia
 * ou falha de rede em zonas rurais do Bengo.
 */

import { User, SensorNode, WaterTelemetry, Bulletin, Report, SupportMessage, EmergencyContact, Language, ThemeMode } from '../types';

// Chaves de armazenamento no LocalStorage
const KEYS = {
  CURRENT_USER: 'sabm_current_user',
  USERS: 'sabm_users_list',
  SENSORS: 'sabm_sensors_list',
  TELEMETRY: 'sabm_telemetry_history',
  BULLETINS: 'sabm_bulletins_list',
  REPORTS: 'sabm_reports_list',
  MESSAGES: 'sabm_messages_list',
  LANGUAGE: 'sabm_app_language',
  THEME: 'sabm_app_theme',
};

// Utilisador Predefinido Inicial (Caso não exista nenhum logado)
const DEFAULT_INITIAL_USER: User = {
  id: 'usr-admin-01',
  name: 'Eng. Mateus Neto',
  email: 'admin.mubungo@bengo.gov.ao',
  role: 'admin',
  phone: '+244 923 456 789',
  active: true,
  createdAt: '2026-01-10',
  location: 'Caxito, Bengo',
};

// Lista Seed de Utilisadores com Diferentes Níveis de Permissão
const INITIAL_USERS: User[] = [
  DEFAULT_INITIAL_USER,
  {
    id: 'usr-tech-02',
    name: 'Técnico Manuel Sebastião',
    email: 'tecnico@bengo.gov.ao',
    role: 'tecnico',
    phone: '+244 912 345 678',
    active: true,
    createdAt: '2026-02-01',
    location: 'Bairro Mubungo, Sector A',
  },
  {
    id: 'usr-pcivil-03',
    name: 'Comandante António Zua',
    email: 'protecao.civil@bengo.gov.ao',
    role: 'protecao_civil',
    phone: '+244 934 567 890',
    active: true,
    createdAt: '2026-02-15',
    location: 'Comando Provincial do Bengo',
  },
  {
    id: 'usr-cidadao-04',
    name: 'Ana Maria Kifangondo',
    email: 'ana.kifangondo@gmail.com',
    role: 'cidadao',
    phone: '+244 945 678 901',
    active: true,
    createdAt: '2026-03-01',
    location: 'Bairro Mubungo, Rua Principal',
  },
];

// Sensores Hardware Inicialmente Registados no Rio Dande / Bairro Mubungo
const INITIAL_SENSORS: SensorNode[] = [
  {
    id: 'sns-esp32-01',
    name: 'Estação Ponte do Rio Dande (Caxito)',
    location: 'Rio Dande - Entrada de Caxito',
    lat: -8.5786,
    lng: 13.6642,
    hardwareType: 'ESP32',
    status: 'online',
    distanceToWaterBedMeters: 6.0,
    currentWaterLevelMeters: 2.8, // 2.8m de altura de água
    warningThresholdMeters: 3.5,
    alertThresholdMeters: 4.5,
    criticalThresholdMeters: 5.5,
    lastUpdate: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
    batteryLevelPercent: 94,
    ipAddress: '192.168.1.105',
    triggerPin: 5,
    echoPin: 18,
  },
  {
    id: 'sns-ard-02',
    name: 'Sensor Vala Central do Mubungo',
    location: 'Vala Principal do Bairro Mubungo',
    lat: -8.5821,
    lng: 13.6698,
    hardwareType: 'Arduino_Uno',
    status: 'alerta',
    distanceToWaterBedMeters: 4.0,
    currentWaterLevelMeters: 3.2, // Em Alerta!
    warningThresholdMeters: 2.5,
    alertThresholdMeters: 3.0,
    criticalThresholdMeters: 3.8,
    lastUpdate: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
    batteryLevelPercent: 88,
    triggerPin: 9,
    echoPin: 10,
    analogPin: 0,
  },
  {
    id: 'sns-esp32-03',
    name: 'Sensor Mubungo Baixo - Bóia',
    location: 'Zona Habitacional de Risco (Mubungo)',
    lat: -8.5855,
    lng: 13.6730,
    hardwareType: 'ESP32',
    status: 'online',
    distanceToWaterBedMeters: 3.5,
    currentWaterLevelMeters: 1.4,
    warningThresholdMeters: 2.0,
    alertThresholdMeters: 2.8,
    criticalThresholdMeters: 3.2,
    lastUpdate: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
    batteryLevelPercent: 76,
    ipAddress: '192.168.1.112',
    triggerPin: 12,
    echoPin: 14,
  },
];

// Telemetria Histórica de Leitura dos Sensores (Últimas Horas)
const INITIAL_TELEMETRY: WaterTelemetry[] = [
  { id: 'tel-1', timestamp: '06:00', sensorId: 'sns-ard-02', levelMeters: 1.8, flowRateM3s: 42, status: 'Normal', rainfallMm: 5.0 },
  { id: 'tel-2', timestamp: '08:00', sensorId: 'sns-ard-02', levelMeters: 2.2, flowRateM3s: 58, status: 'Normal', rainfallMm: 12.0 },
  { id: 'tel-3', timestamp: '10:00', sensorId: 'sns-ard-02', levelMeters: 2.6, flowRateM3s: 74, status: 'Atenção', rainfallMm: 24.5 },
  { id: 'tel-4', timestamp: '12:00', sensorId: 'sns-ard-02', levelMeters: 3.2, flowRateM3s: 92, status: 'Alerta', rainfallMm: 41.0 },
  { id: 'tel-5', timestamp: '14:00', sensorId: 'sns-ard-02', levelMeters: 3.1, flowRateM3s: 88, status: 'Alerta', rainfallMm: 18.2 },
];

// Boletins Hidrometeorológicos Oficiais Registados
const INITIAL_BULLETINS: Bulletin[] = [
  {
    id: 'bol-1',
    code: 'BOL-BENGO-2026-004',
    title: 'Aviso de Subida Repentina do Leito do Rio Dande e Vala do Mubungo',
    content: 'Devido às fortes chuvas registadas nas cabeceiras do Rio Dande na província do Uíge e Bengo, prevê-se um aumento significativo do volume de água nas próximas 12 horas no Bairro Mubungo.',
    date: '2026-07-29',
    severity: 'Alerta',
    author: 'Comando Provincial da Proteção Civil do Bengo',
    location: 'Bairro Mubungo, Caxito',
    instructions: 'Moradores das zonas baixas do Mubungo devem colocar documentos e bens essenciais em locais elevados e acompanhar os sinais sonoros da Proteção Civil.',
  },
  {
    id: 'bol-2',
    code: 'BOL-BENGO-2026-003',
    title: 'Manutenção Preventiva das Calhas e Desassoreamento do Mubungo',
    content: 'Equipas do Governo Provincial do Bengo iniciaram a limpeza das valas de escoamento secundárias para facilitar o fluxo de água das chuvas.',
    date: '2026-07-25',
    severity: 'Normal',
    author: 'Governo Provincial do Bengo',
    location: 'Município do Dande - Caxito',
    instructions: 'Evitar o descarte de resíduos sólidos nas valas de drenagem do bairro.',
  },
];

// Relatórios Oficiais do Sistema
const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    code: 'REL-BENGO-2026-01',
    title: 'Relatório Técnico de Impacto de Precipitação no Bairro Mubungo',
    date: '2026-07-28',
    createdBy: 'Eng. Mateus Neto',
    creatorRole: 'Administrador / Engenheiro Hídrico',
    description: 'Análise detalhada do pico de caudal registado pelos sensores ESP32 e Arduino Uno instalados na Vala do Mubungo e na Ponte de Caxito.',
    avgWaterLevelMeters: 2.85,
    maxWaterLevelMeters: 3.4,
    floodEventsCount: 2,
    affectedFamiliesEstimate: 35,
    riskZone: 'Bairro Mubungo - Zonas A e B (Margem Baixa)',
    recommendations: 'Recomenda-se o reforço dos sacos de areia na margem sul e ativação preventiva do Ponto de Encontro da Escola Primária do Mubungo.',
    status: 'Publicado',
  },
];

// Mensagens de Suporte e Denúncias da Comunidade
const INITIAL_MESSAGES: SupportMessage[] = [
  {
    id: 'msg-1',
    senderName: 'João Baptista Zua',
    senderPhone: '+244 923 111 222',
    neighborhood: 'Mubungo Sector C',
    message: 'A água da vala começou a transbordar perto da travessa 4. Precisamos de sacos de contenção de areia urgentes!',
    date: '2026-07-29 11:30',
    status: 'Pendente',
    category: 'Denúncia de Risco',
  },
  {
    id: 'msg-2',
    senderName: 'Teresa Cambinda',
    senderPhone: '+244 912 888 999',
    neighborhood: 'Mubungo Centro',
    message: 'Como faço para receber os alertas SMS no meu telefone sem internet?',
    date: '2026-07-28 16:45',
    status: 'Atendido',
    category: 'Dúvida Técnica',
    response: 'Os alertas SMS são enviados automaticamente pela Proteção Civil para todos os números cadastrados na operadora local.',
  },
];

// Contactos Oficiais de Emergência no Bengo
export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: 'c1', name: 'Proteção Civil e Bombeiros do Bengo', organization: 'Governo Provincial', phone: '115 / 923 000 112', location: 'Caxito, Bengo', availableHours: '24/7' },
  { id: 'c2', name: 'Comando Provincial da Polícia Nacional', organization: 'Polícia Nacional', phone: '113 / 934 111 000', location: 'Caxito - Centro', availableHours: '24/7' },
  { id: 'c3', name: 'Hospital Geral de Caxito', organization: 'Ministério da Saúde', phone: '924 111 222', location: 'Estrada Nacional Caxito', availableHours: '24/7' },
  { id: 'c4', name: 'Administração Municipal do Dande', organization: 'Administração Local', phone: '912 000 333', location: 'Caxito - Dande', availableHours: '08:00 - 16:00' },
];

/**
 * Método de Inicialização do LocalStorage caso os dados não existam
 */
export function initLocalStorage(): void {
  // Verifica e carrega Utilisador Atual
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(DEFAULT_INITIAL_USER));
  }

  // Verifica e carrega Lista de Utilisadores
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }

  // Verifica e carrega Lista de Sensores
  if (!localStorage.getItem(KEYS.SENSORS)) {
    localStorage.setItem(KEYS.SENSORS, JSON.stringify(INITIAL_SENSORS));
  }

  // Verifica e carrega Histórico de Telemetria
  if (!localStorage.getItem(KEYS.TELEMETRY)) {
    localStorage.setItem(KEYS.TELEMETRY, JSON.stringify(INITIAL_TELEMETRY));
  }

  // Verifica e carrega Lista de Boletins
  if (!localStorage.getItem(KEYS.BULLETINS)) {
    localStorage.setItem(KEYS.BULLETINS, JSON.stringify(INITIAL_BULLETINS));
  }

  // Verifica e carrega Lista de Relatórios
  if (!localStorage.getItem(KEYS.REPORTS)) {
    localStorage.setItem(KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
  }

  // Verifica e carrega Mensagens de Suporte
  if (!localStorage.getItem(KEYS.MESSAGES)) {
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
  }

  // Verifica Idioma Padrão
  if (!localStorage.getItem(KEYS.LANGUAGE)) {
    localStorage.setItem(KEYS.LANGUAGE, 'pt');
  }

  // Verifica Tema Padrão
  if (!localStorage.getItem(KEYS.THEME)) {
    localStorage.setItem(KEYS.THEME, 'light');
  }
}

// ================= USER SESSION HELPERS =================
export function getCurrentUser(): User {
  initLocalStorage();
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : DEFAULT_INITIAL_USER;
}

export function setCurrentUser(user: User): void {
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
}

export function getUsers(): User[] {
  initLocalStorage();
  const data = localStorage.getItem(KEYS.USERS);
  return data ? JSON.parse(data) : INITIAL_USERS;
}

export function saveUsers(users: User[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

// ================= SENSORS HELPERS =================
export function getSensors(): SensorNode[] {
  initLocalStorage();
  const data = localStorage.getItem(KEYS.SENSORS);
  return data ? JSON.parse(data) : INITIAL_SENSORS;
}

export function saveSensors(sensors: SensorNode[]): void {
  localStorage.setItem(KEYS.SENSORS, JSON.stringify(sensors));
}

export function updateSensorLevel(sensorId: string, newLevelMeters: number): void {
  const sensors = getSensors();
  const updated = sensors.map(s => {
    if (s.id === sensorId) {
      let status: 'online' | 'alerta' = 'online';
      if (newLevelMeters >= s.alertThresholdMeters) {
        status = 'alerta';
      }
      return {
        ...s,
        currentWaterLevelMeters: newLevelMeters,
        status,
        lastUpdate: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
      };
    }
    return s;
  });
  saveSensors(updated);
}

// ================= TELEMETRY HELPERS =================
export function getTelemetry(): WaterTelemetry[] {
  initLocalStorage();
  const data = localStorage.getItem(KEYS.TELEMETRY);
  return data ? JSON.parse(data) : INITIAL_TELEMETRY;
}

export function addTelemetryEntry(entry: WaterTelemetry): void {
  const history = getTelemetry();
  const updated = [entry, ...history.slice(0, 20)]; // Mantém os 20 registos mais recentes
  localStorage.setItem(KEYS.TELEMETRY, JSON.stringify(updated));
}

// ================= BULLETINS HELPERS =================
export function getBulletins(): Bulletin[] {
  initLocalStorage();
  const data = localStorage.getItem(KEYS.BULLETINS);
  return data ? JSON.parse(data) : INITIAL_BULLETINS;
}

export function saveBulletin(bulletin: Bulletin): void {
  const list = getBulletins();
  const updated = [bulletin, ...list];
  localStorage.setItem(KEYS.BULLETINS, JSON.stringify(updated));
}

// ================= REPORTS HELPERS =================
export function getReports(): Report[] {
  initLocalStorage();
  const data = localStorage.getItem(KEYS.REPORTS);
  return data ? JSON.parse(data) : INITIAL_REPORTS;
}

export function saveReport(report: Report): void {
  const list = getReports();
  const updated = [report, ...list];
  localStorage.setItem(KEYS.REPORTS, JSON.stringify(updated));
}

// ================= MESSAGES HELPERS =================
export function getMessages(): SupportMessage[] {
  initLocalStorage();
  const data = localStorage.getItem(KEYS.MESSAGES);
  return data ? JSON.parse(data) : INITIAL_MESSAGES;
}

export function saveMessage(msg: SupportMessage): void {
  const list = getMessages();
  const updated = [msg, ...list];
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify(updated));
}

export function updateMessageResponse(msgId: string, responseText: string): void {
  const list = getMessages();
  const updated = list.map(m => m.id === msgId ? { ...m, response: responseText, status: 'Atendido' as const } : m);
  localStorage.setItem(KEYS.MESSAGES, JSON.stringify(updated));
}

// ================= LANGUAGE & THEME =================
export function getLanguage(): Language {
  initLocalStorage();
  return (localStorage.getItem(KEYS.LANGUAGE) as Language) || 'pt';
}

export function setLanguage(lang: Language): void {
  localStorage.setItem(KEYS.LANGUAGE, lang);
}

export function getTheme(): ThemeMode {
  initLocalStorage();
  return (localStorage.getItem(KEYS.THEME) as ThemeMode) || 'light';
}

export function setTheme(theme: ThemeMode): void {
  localStorage.setItem(KEYS.THEME, theme);
}
