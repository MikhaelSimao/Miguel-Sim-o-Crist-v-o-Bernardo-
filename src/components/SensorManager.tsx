/**
 * @file src/components/SensorManager.tsx
 * @description Módulo de Configuração de Sensores Hardware (Arduino Uno & ESP32) e Gerador de Firmware C++
 */

import React, { useState } from 'react';
import { Cpu, Wifi, Radio, Plus, Edit, Trash2, Code2, Copy, Check, Terminal, Play, Save, CheckCircle2 } from 'lucide-react';
import { SensorNode, HardwareType, SensorStatus, Language, User } from '../types';
import { getSensors, saveSensors } from '../services/storage';
import { getTranslation } from '../data/translations';

interface SensorManagerProps {
  currentLang: Language;
  currentUser: User;
}

export const SensorManager: React.FC<SensorManagerProps> = ({ currentLang, currentUser }) => {
  const [sensors, setSensors] = useState<SensorNode[]>(getSensors());
  const [activeTab, setActiveTab] = useState<'list' | 'esp32_firmware' | 'arduino_firmware' | 'terminal'>('list');
  const [copied, setCopied] = useState<boolean>(false);

  // Estados para Adicionar/Editar Sensor
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSensor, setEditingSensor] = useState<SensorNode | null>(null);

  // Estados para Teste de Envio de Payload
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [testLevelInput, setTestLevelInput] = useState<string>('3.20');

  // Guardar ou Atualizar Sensor
  const handleSaveSensor = (sensorData: SensorNode) => {
    let updated: SensorNode[];
    if (editingSensor) {
      updated = sensors.map(s => s.id === sensorData.id ? sensorData : s);
    } else {
      updated = [sensorData, ...sensors];
    }
    setSensors(updated);
    saveSensors(updated);
    setIsModalOpen(false);
    setEditingSensor(null);
  };

  // Remover Sensor
  const handleDeleteSensor = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este sensor hardware do Bairro Mubungo?')) {
      const updated = sensors.filter(s => s.id !== id);
      setSensors(updated);
      saveSensors(updated);
    }
  };

  // Código C++ Firmware para ESP32
  const esp32Code = `
/* 
 * Firmware C++ para Microcontrolador ESP32
 * Sistema de Alerta de Inundação do Bengo (Bairro Mubungo)
 * Placa: ESP32 DevKit V1 | Sensor: HC-SR04 Ultrassónico
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// Configuração de Wi-Fi local no Bengo
const char* ssid = "PROTECAO_CIVIL_BENGO";
const char* password = "SABM_PASSWORD_2026";

// Endereço da API do Sistema
const char* serverUrl = "https://sabm-bengo.gov.ao/api/telemetry";

// Pinos do Sensor Ultrassónico HC-SR04
#define TRIGGER_PIN 5
#define ECHO_PIN    18

// Distância de referência do sensor ao leito da vala (em cm)
const float SENSOR_HEIGHT_CM = 600.0; 

void setup() {
  Serial.begin(115200);
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\n[ESP32 Mubungo] Conectado ao Wi-Fi com Sucesso!");
}

void loop() {
  // Leitura do Sensor HC-SR04
  digitalWrite(TRIGGER_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGGER_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGGER_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  float distanceCm = duration * 0.034 / 2;
  
  // Cálculo da altura de água atual no Rio Dande / Mubungo (em metros)
  float waterLevelMeters = (SENSOR_HEIGHT_CM - distanceCm) / 100.0;
  if (waterLevelMeters < 0) waterLevelMeters = 0.0;

  Serial.print("Nível da Água Medido: ");
  Serial.print(waterLevelMeters);
  Serial.println(" m");

  // Envio do Payload JSON via HTTP POST
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<200> doc;
    doc["sensorId"] = "sns-esp32-01";
    doc["waterLevelMeters"] = waterLevelMeters;
    doc["hardware"] = "ESP32";
    doc["batteryPercent"] = 92;

    String jsonPayload;
    serializeJson(doc, jsonPayload);

    int httpCode = http.POST(jsonPayload);
    Serial.print("Resposta HTTP POST: ");
    Serial.println(httpCode);

    http.end();
  }

  delay(10000); // Envia telemetria a cada 10 segundos
}
`;

  // Código C++ Firmware para Arduino Uno
  const arduinoCode = `
/* 
 * Firmware C++ para Microcontrolador Arduino Uno
 * Sistema de Alerta de Inundação do Bengo (Bairro Mubungo)
 * Placa: Arduino Uno R3 | Sensor: HC-SR04 + LCD 16x2 + Buzzer
 */

#include <LiquidCrystal.h>

// Pinos do Sensor Ultrassónico HC-SR04
const int trigPin = 9;
const int echoPin = 10;

// Pino do Buzzer de Emergência Local
const int buzzerPin = 8;

// LCD 16x2 Pins (RS, E, D4, D5, D6, D7)
LiquidCrystal lcd(12, 11, 5, 4, 3, 2);

const float SENSOR_HEIGHT_CM = 400.0; // 4 metros

void setup() {
  Serial.begin(9600); // Transmissão Serial
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);

  lcd.begin(16, 2);
  lcd.print("SABM BENGO");
  lcd.setCursor(0, 1);
  lcd.print("Mubungo Sensor");
  delay(2000);
  lcd.clear();
}

void loop() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(trigPin, HIGH);
  float distanceCm = duration * 0.034 / 2;
  float waterLevelMeters = (SENSOR_HEIGHT_CM - distanceCm) / 100.0;

  if (waterLevelMeters < 0) waterLevelMeters = 0.0;

  // Atualiza Mostrar LCD Local
  lcd.setCursor(0, 0);
  lcd.print("Nivel: ");
  lcd.print(waterLevelMeters);
  lcd.print(" m  ");

  // Alerta Sonoro Local no Bairro Mubungo se Nível > 3.0m
  if (waterLevelMeters >= 3.0) {
    lcd.setCursor(0, 1);
    lcd.print("ALERTA CHEIA!   ");
    digitalWrite(buzzerPin, HIGH);
  } else {
    lcd.setCursor(0, 1);
    lcd.print("Estado: Normal  ");
    digitalWrite(buzzerPin, LOW);
  }

  // Transmissão Serial para Gateway / LocalStorage
  Serial.print("{\"sensorId\":\"sns-ard-02\",\"waterLevelMeters\":");
  Serial.print(waterLevelMeters);
  Serial.println("}");

  delay(2000);
}
`;

  // Copiar código para clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simular Envio de Pacote Serial / HTTP no Terminal
  const handleSimulateTerminalTest = () => {
    const time = new Date().toLocaleTimeString();
    const newLogs = [
      `[${time}] [HARDWARE_INIT] Inicializando porta serial COM4 (ESP32/Arduino)...`,
      `[${time}] [PAYLOAD_RX] {"sensorId":"sns-esp32-01","level":${testLevelInput},"status":"ACK_200"}`,
      `[${time}] [SUCCESS] Pacote processado e armazenado no LocalStorage do Bengo!`,
    ];
    setTerminalOutput(prev => [...newLogs, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Módulo */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-bold text-lg text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-400" />
            {getTranslation(currentLang, 'hardwareSectionTitle')}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {getTranslation(currentLang, 'hardwareSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'admin' || currentUser.role === 'tecnico' ? (
            <button
              onClick={() => {
                setEditingSensor(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Adicionar Novo Sensor
            </button>
          ) : (
            <span className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1 rounded-xl border border-amber-500/20">
              Modo Leitura (Apenas Técnicos/Admin podem modificar)
            </span>
          )}
        </div>
      </div>

      {/* Separadores de Módulo Hardware */}
      <div className="flex border-b border-slate-800 bg-slate-900/50 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'list' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          Sensores Registados ({sensors.length})
        </button>

        <button
          onClick={() => setActiveTab('esp32_firmware')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'esp32_firmware' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wifi className="w-4 h-4" />
          {getTranslation(currentLang, 'esp32Guide')}
        </button>

        <button
          onClick={() => setActiveTab('arduino_firmware')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'arduino_firmware' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          {getTranslation(currentLang, 'arduinoGuide')}
        </button>

        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
            activeTab === 'terminal' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          Console Serial / Testes JSON
        </button>
      </div>

      {/* CONTEÚDO 1: LISTA DE SENSORES HARDWARE */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensors.map((s) => (
            <div
              key={s.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    s.hardwareType === 'ESP32' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {s.hardwareType}
                  </span>
                  <h3 className="font-bold text-sm text-white mt-1.5">{s.name}</h3>
                  <p className="text-xs text-slate-400">{s.location}</p>
                </div>

                <div className={`w-3 h-3 rounded-full ${
                  s.status === 'alerta' ? 'bg-red-500 animate-ping' : 'bg-emerald-500'
                }`} title={`Estado: ${s.status}`} />
              </div>

              <div className="bg-slate-800/60 rounded-xl p-3 text-xs space-y-1.5 border border-slate-700/60 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Nível Atual:</span>
                  <span className="font-bold text-white">{s.currentWaterLevelMeters.toFixed(2)} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Limiar Alerta:</span>
                  <span className="font-bold text-amber-400">{s.alertThresholdMeters} m</span>
                </div>
                {s.ipAddress && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">IP Wi-Fi:</span>
                    <span className="text-blue-400">{s.ipAddress}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">Último Ping:</span>
                  <span className="text-slate-300">{s.lastUpdate}</span>
                </div>
              </div>

              {/* Ações para Admin/Técnico */}
              {(currentUser.role === 'admin' || currentUser.role === 'tecnico') && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setEditingSensor(s);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-800"
                    title="Editar Sensor"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteSensor(s.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800"
                    title="Eliminar Sensor"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* CONTEÚDO 2: CÓDIGO FIRMWARE ESP32 */}
      {activeTab === 'esp32_firmware' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Wifi className="w-5 h-5 text-blue-400" />
                Firmware C++ Oficial para ESP32 (Wi-Fi / HTTP POST)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Carregue este código no Arduino IDE para programar o microcontrolador ESP32 no Bairro Mubungo
              </p>
            </div>
            <button
              onClick={() => handleCopyCode(esp32Code)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : getTranslation(currentLang, 'copyCode')}
            </button>
          </div>

          <pre className="bg-slate-950 text-cyan-300 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 max-h-[450px]">
            {esp32Code}
          </pre>
        </div>
      )}

      {/* CONTEÚDO 3: CÓDIGO FIRMWARE ARDUINO UNO */}
      {activeTab === 'arduino_firmware' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                Firmware C++ Oficial para Arduino Uno R3 (HC-SR04 + Buzzer)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Código para Arduino Uno conectado via porta Serial com ecrã LCD 16x2 e alarme sonoro
              </p>
            </div>
            <button
              onClick={() => handleCopyCode(arduinoCode)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : getTranslation(currentLang, 'copyCode')}
            </button>
          </div>

          <pre className="bg-slate-950 text-emerald-300 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 max-h-[450px]">
            {arduinoCode}
          </pre>
        </div>
      )}

      {/* CONTEÚDO 4: CONSOLE SERIAL DE TESTE */}
      {activeTab === 'terminal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                Simulador de Console Serial do Hardware
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Envie leituras de teste simulando a transmissão direta das placas no Bengo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              step="0.1"
              value={testLevelInput}
              onChange={(e) => setTestLevelInput(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs focus:outline-none"
              placeholder="Ex: 3.5m"
            />
            <button
              onClick={handleSimulateTerminalTest}
              className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
            >
              <Play className="w-4 h-4 fill-current" />
              Transmitir Pacote JSON
            </button>
          </div>

          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-emerald-400 min-h-[220px] max-h-[300px] overflow-y-auto space-y-1">
            {terminalOutput.length === 0 ? (
              <span className="text-slate-600">A aguardar dados da porta serial do ESP32/Arduino...</span>
            ) : (
              terminalOutput.map((log, idx) => (
                <div key={idx} className="border-b border-slate-900/80 pb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL PARA ADICIONAR / EDITAR SENSOR */}
      {isModalOpen && (
        <SensorFormModal
          sensor={editingSensor}
          onSave={handleSaveSensor}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

// SUBCOMPONENTE MODAL DO FORMULÁRIO DE SENSOR
const SensorFormModal: React.FC<{
  sensor: SensorNode | null;
  onSave: (data: SensorNode) => void;
  onClose: () => void;
}> = ({ sensor, onSave, onClose }) => {
  const [name, setName] = useState(sensor?.name || '');
  const [location, setLocation] = useState(sensor?.location || '');
  const [hardwareType, setHardwareType] = useState<HardwareType>(sensor?.hardwareType || 'ESP32');
  const [distanceToWaterBedMeters, setDistance] = useState(sensor?.distanceToWaterBedMeters || 5.0);
  const [alertThresholdMeters, setAlert] = useState(sensor?.alertThresholdMeters || 3.0);
  const [ipAddress, setIp] = useState(sensor?.ipAddress || '192.168.1.100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: sensor?.id || `sns-${Date.now()}`,
      name,
      location,
      lat: sensor?.lat || -8.5815,
      lng: sensor?.lng || 13.6680,
      hardwareType,
      status: sensor?.status || 'online',
      distanceToWaterBedMeters: Number(distanceToWaterBedMeters),
      currentWaterLevelMeters: sensor?.currentWaterLevelMeters || 2.0,
      warningThresholdMeters: Number(alertThresholdMeters) * 0.8,
      alertThresholdMeters: Number(alertThresholdMeters),
      criticalThresholdMeters: Number(alertThresholdMeters) * 1.25,
      lastUpdate: 'Agora',
      batteryLevelPercent: 95,
      ipAddress,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white space-y-4">
        <h3 className="font-bold text-base">
          {sensor ? 'Editar Configuração do Sensor' : 'Adicionar Novo Sensor Hardware'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nome do Sensor</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Sensor Vala Mubungo Leste"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Localização no Bairro</label>
            <input
              type="text"
              required
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Ex: Mubungo Sector B"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tipo de Placa</label>
              <select
                value={hardwareType}
                onChange={e => setHardwareType(e.target.value as HardwareType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white cursor-pointer"
              >
                <option value="ESP32">ESP32 DevKit (Wi-Fi)</option>
                <option value="Arduino_Uno">Arduino Uno R3 (Serial)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Limiar de Alerta (m)</label>
              <input
                type="number"
                step="0.1"
                value={alertThresholdMeters}
                onChange={e => setAlert(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">IP do Dispositivo (para ESP32)</label>
            <input
              type="text"
              value={ipAddress}
              onChange={e => setIp(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
            />
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
              Guardar Configuração
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
