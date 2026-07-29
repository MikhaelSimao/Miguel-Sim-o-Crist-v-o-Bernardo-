/**
 * @file src/types.ts
 * @description Definições de Tipos e Interfaces para o Sistema de Alerta de Inundação do Bengo (Mubungo)
 * 
 * Este ficheiro contém todas as estruturas de dados utilizadas no sistema, incluindo
 * utilizadores, papéis de acesso, sensores hardware (ESP32 / Arduino Uno), boletins,
 * relatórios, telemetria e suporte de idiomas.
 */

// Níveis de permissão do sistema
export type UserRole = 'admin' | 'tecnico' | 'protecao_civil' | 'cidadao';

// Estrutura de Utilizador
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  active: boolean;
  createdAt: string;
  avatar?: string;
  location?: string;
}

// Tipos de Sensores Hardware Suportados
export type HardwareType = 'ESP32' | 'Arduino_Uno' | 'Estacao_Meteo';

// Estado do Sensor
export type SensorStatus = 'online' | 'offline' | 'alerta';

// Configuração e Estado de cada Sensor de Água
export interface SensorNode {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  hardwareType: HardwareType;
  status: SensorStatus;
  distanceToWaterBedMeters: number; // Distância de referência ao leito do rio (m)
  currentWaterLevelMeters: number;   // Nível de água medido atualmente (m)
  warningThresholdMeters: number;    // Nível de Atenção (Amarelo)
  alertThresholdMeters: number;      // Nível de Alerta (Laranja)
  criticalThresholdMeters: number;   // Nível de Emergência (Vermelho)
  lastUpdate: string;
  batteryLevelPercent: number;       // Bateria / Alimentação
  ipAddress?: string;                // IP para ESP32 Wi-Fi
  macAddress?: string;
  triggerPin?: number;               // Pino HC-SR04 Trigger (Arduino/ESP32)
  echoPin?: number;                  // Pino HC-SR04 Echo
  analogPin?: number;                // Pino Sensor de bóia
}

// Telemetria histórica do nível do Rio Dande / Vala do Mubungo
export interface WaterTelemetry {
  id: string;
  timestamp: string;
  sensorId: string;
  levelMeters: number;
  flowRateM3s: number;               // Caudal estimado em m³/s
  status: 'Normal' | 'Atenção' | 'Alerta' | 'Emergência';
  rainfallMm: number;                // Precipitação pluviométrica em mm
}

// Níveis de severidade do boletim de cheia
export type SeverityLevel = 'Normal' | 'Atenção' | 'Alerta' | 'Emergência';

// Boletim Hidrometeorológico Oficial
export interface Bulletin {
  id: string;
  code: string;                      // ex: BOL-2026-001
  title: string;
  content: string;
  date: string;
  severity: SeverityLevel;
  author: string;
  location: string;
  instructions: string;             // Recomendações à população do Mubungo
}

// Relatório Técnico e Operacional de Inundação
export interface Report {
  id: string;
  code: string;                      // ex: REL-BENGO-2026-08
  title: string;
  date: string;
  createdBy: string;
  creatorRole: string;
  description: string;
  avgWaterLevelMeters: number;
  maxWaterLevelMeters: number;
  floodEventsCount: number;
  affectedFamiliesEstimate: number;
  riskZone: string;                  // ex: "Bairro Mubungo - Sector B"
  recommendations: string;
  status: 'Rascunho' | 'Publicado' | 'Arquivado';
}

// Mensagem e Suporte da Comunidade
export interface SupportMessage {
  id: string;
  senderName: string;
  senderPhone: string;
  neighborhood: string;             // ex: Mubungo Centro, Vala, Caxito
  message: string;
  date: string;
  status: 'Pendente' | 'Em Análise' | 'Atendido';
  category: 'Denúncia de Risco' | 'Pedido de Ajuda' | 'Dúvida Técnica' | 'Geral';
  response?: string;
}

// Contactos de Emergência do Bengo
export interface EmergencyContact {
  id: string;
  name: string;
  organization: string;
  phone: string;
  location: string;
  availableHours: string;
}

// Idiomas Suportados
export type Language = 'pt' | 'kmb' | 'en';

// Tema da Aplicação
export type ThemeMode = 'light' | 'dark';
