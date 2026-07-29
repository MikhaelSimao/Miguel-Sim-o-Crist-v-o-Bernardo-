/**
 * @file src/components/Dashboard.tsx
 * @description Painel Inicial com Níveis de Água em Tempo Real, Gráfico Animado e Simulador de Alerta
 */

import React, { useState, useEffect } from 'react';
import { Waves, AlertTriangle, CloudRain, Wind, Activity, ArrowUpRight, Cpu, Radio, ShieldAlert, Sliders, Volume2 } from 'lucide-react';
import { SensorNode, WaterTelemetry, Language, User } from '../types';
import { getSensors, getTelemetry, updateSensorLevel, addTelemetryEntry } from '../services/storage';
import { getTranslation } from '../data/translations';

interface DashboardProps {
  currentLang: Language;
  currentUser: User;
  onNavigateToTab: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentLang,
  currentUser,
  onNavigateToTab,
}) => {
  const [sensors, setSensors] = useState<SensorNode[]>([]);
  const [telemetry, setTelemetry] = useState<WaterTelemetry[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<string>('sns-ard-02');
  
  // Estado para o simulador de nível em tempo real
  const [simulatedLevel, setSimulatedLevel] = useState<number>(3.2);

  // Carrega dados do LocalStorage ao montar o componente
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    const list = getSensors();
    setSensors(list);
    const telem = getTelemetry();
    setTelemetry(telem);
    
    // Define o valor inicial do slider com base no sensor selecionado
    const selected = list.find(s => s.id === selectedSensorId) || list[0];
    if (selected) {
      setSimulatedLevel(selected.currentWaterLevelMeters);
    }
  };

  // Sensor Ativo Selecionado
  const activeSensor = sensors.find(s => s.id === selectedSensorId) || sensors[0] || {
    id: 'sns-ard-02',
    name: 'Sensor Vala Central do Mubungo',
    location: 'Vala Principal do Bairro Mubungo',
    hardwareType: 'Arduino_Uno',
    status: 'alerta',
    distanceToWaterBedMeters: 4.0,
    currentWaterLevelMeters: 3.2,
    warningThresholdMeters: 2.5,
    alertThresholdMeters: 3.0,
    criticalThresholdMeters: 3.8,
    lastUpdate: 'Agora',
    batteryLevelPercent: 88,
  };

  // Cálculo da percentagem de enchimento do tanque para a animação
  const maxCapacityMeters = activeSensor.distanceToWaterBedMeters || 5.0;
  const fillPercent = Math.min(100, Math.max(0, (simulatedLevel / maxCapacityMeters) * 100));

  // Determina o estado do risco com base na altura da água
  let riskStatus: 'Normal' | 'Atenção' | 'Alerta' | 'Emergência' = 'Normal';
  let badgeColor = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';

  if (simulatedLevel >= activeSensor.criticalThresholdMeters) {
    riskStatus = 'Emergência';
    badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse';
  } else if (simulatedLevel >= activeSensor.alertThresholdMeters) {
    riskStatus = 'Alerta';
    badgeColor = 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  } else if (simulatedLevel >= activeSensor.warningThresholdMeters) {
    riskStatus = 'Atenção';
    badgeColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  }

  // Manipulador de mudança do nível no simulador em tempo real
  const handleLevelSliderChange = (newVal: number) => {
    setSimulatedLevel(newVal);
    updateSensorLevel(activeSensor.id, newVal);

    // Regista entrada no histórico de telemetria do LocalStorage
    const newEntry: WaterTelemetry = {
      id: `tel-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
      sensorId: activeSensor.id,
      levelMeters: newVal,
      flowRateM3s: Math.round(newVal * 28),
      status: riskStatus,
      rainfallMm: Math.round(newVal * 12),
    };

    addTelemetryEntry(newEntry);
  };

  return (
    <div className="space-y-6">
      {/* Banner de Alerta Crítico se estiver em Alerta ou Emergência */}
      {(riskStatus === 'Alerta' || riskStatus === 'Emergência') && (
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between flex-wrap gap-3 animate-pulse border border-red-400/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-950/40 rounded-xl">
              <ShieldAlert className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base uppercase tracking-wider flex items-center gap-2">
                ALERTA DE INUNDAÇÃO EM CURSO NO MUFUNGO ({riskStatus.toUpperCase()})
              </h2>
              <p className="text-xs text-red-100 mt-0.5">
                Nível da água na Vala do Mubungo atingiu <strong className="underline">{simulatedLevel.toFixed(2)}m</strong>. Recomenda-se a evacuação imediata das habitações na margem baixa.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('map')}
            className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition-all border border-amber-400/30 flex items-center gap-1.5"
          >
            Ver Mapa de Fuga & Pontos de Encontro
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Cartões Principais de Indicadores Hídricos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cartão 1: Nível Atual */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {getTranslation(currentLang, 'currentWaterLevel')}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Waves className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {simulatedLevel.toFixed(2)}
            </span>
            <span className="text-slate-400 font-medium text-sm">metros</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-400">Estado da Bacia:</span>
            <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${badgeColor}`}>
              {riskStatus}
            </span>
          </div>
        </div>

        {/* Cartão 2: Caudal Estabilizado */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {getTranslation(currentLang, 'flowRate')}
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Wind className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {Math.round(simulatedLevel * 28)}
            </span>
            <span className="text-slate-400 font-medium text-sm">m³/s</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Medição por Ultrassom ESP32/Arduino</span>
          </div>
        </div>

        {/* Cartão 3: Precipitação acumulada */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {getTranslation(currentLang, 'rainfall')}
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {Math.round(simulatedLevel * 12.5)}
            </span>
            <span className="text-slate-400 font-medium text-sm">mm / 24h</span>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            <span>Chuva forte na Bacia do Rio Dande</span>
          </div>
        </div>

        {/* Cartão 4: Estado da Rede de Sensores */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {getTranslation(currentLang, 'activeSensors')}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {sensors.length}
            </span>
            <span className="text-slate-400 font-medium text-sm">placas ativas</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Arduino Uno (1) & ESP32 (2)</span>
          </div>
        </div>
      </div>

      {/* Painel Central: Visualizador Gráfico de Nível (Tanque Líquido Animado) + Simulador de Telemetria */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Tanque Gráfico e Medidor de Nível da Água */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Waves className="w-5 h-5 text-blue-400" />
                Medidor Visual do Leito Hídrico (Mubungo)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Representação gráfica em tempo real do volume acumulado no canal de drenagem do Bairro Mubungo
              </p>
            </div>

            {/* Seletor do Sensor Ativo */}
            <select
              value={selectedSensorId}
              onChange={(e) => {
                setSelectedSensorId(e.target.value);
                const s = sensors.find(x => x.id === e.target.value);
                if (s) setSimulatedLevel(s.currentWaterLevelMeters);
              }}
              className="bg-slate-800 text-xs font-semibold text-white border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              {sensors.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.hardwareType})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Tanque Gráfico Animado */}
            <div className="md:col-span-1 flex flex-col items-center justify-center">
              <div className="w-40 h-64 bg-slate-950 border-2 border-slate-700 rounded-3xl p-2 relative overflow-hidden shadow-2xl flex flex-col justify-end">
                {/* Linhas de Threshold (Atenção / Alerta / Emergência) */}
                <div
                  className="absolute w-full left-0 border-b-2 border-dashed border-yellow-400/80 z-20 flex items-center justify-end pr-2"
                  style={{ bottom: `${(activeSensor.warningThresholdMeters / maxCapacityMeters) * 100}%` }}
                >
                  <span className="text-[9px] bg-yellow-950/80 text-yellow-300 font-bold px-1 rounded">
                    Atenção {activeSensor.warningThresholdMeters}m
                  </span>
                </div>

                <div
                  className="absolute w-full left-0 border-b-2 border-dashed border-red-500/90 z-20 flex items-center justify-end pr-2"
                  style={{ bottom: `${(activeSensor.alertThresholdMeters / maxCapacityMeters) * 100}%` }}
                >
                  <span className="text-[9px] bg-red-950/80 text-red-300 font-bold px-1 rounded">
                    Alerta {activeSensor.alertThresholdMeters}m
                  </span>
                </div>

                {/* Coluna de Água Animada com Gradiente */}
                <div
                  className="w-full bg-gradient-to-t from-blue-700 via-cyan-500 to-blue-400 rounded-b-2xl transition-all duration-500 relative overflow-hidden"
                  style={{ height: `${fillPercent}%` }}
                >
                  {/* Efeito Onda no topo do líquido */}
                  <div className="absolute top-0 left-0 right-0 h-3 bg-white/30 animate-pulse rounded-t-full" />
                </div>

                {/* Indicador Numérico sobreposto */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                  <div className="bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-center shadow-lg">
                    <span className="text-xl font-black text-white">{simulatedLevel.toFixed(2)}</span>
                    <span className="text-[10px] text-blue-300 font-bold block">METROS</span>
                  </div>
                </div>
              </div>

              <span className="text-xs text-slate-400 mt-2 font-medium">
                Capacidade Máxima: {maxCapacityMeters}m
              </span>
            </div>

            {/* Informações dos Parâmetros do Sensor e Hardware */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-xs text-slate-400">Localização do Sensor:</span>
                  <span className="text-xs font-semibold text-white">{activeSensor.location}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-xs text-slate-400">Hardware Utilizado:</span>
                  <span className="text-xs font-bold text-blue-400 uppercase">{activeSensor.hardwareType}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-xs text-slate-400">Nível Amarelo (Atenção):</span>
                  <span className="text-xs font-bold text-yellow-400">{activeSensor.warningThresholdMeters}m</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-xs text-slate-400">Nível Laranja (Alerta):</span>
                  <span className="text-xs font-bold text-amber-400">{activeSensor.alertThresholdMeters}m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Nível Vermelho (Emergência):</span>
                  <span className="text-xs font-bold text-red-400">{activeSensor.criticalThresholdMeters}m</span>
                </div>
              </div>

              {/* Controlo Interativo de Simulação para Testes de Campo */}
              <div className="bg-blue-950/30 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-blue-400" />
                    {getTranslation(currentLang, 'simulatedLevelControl')}
                  </label>
                  <span className="text-xs font-mono font-bold text-blue-200 bg-blue-900/60 px-2 py-0.5 rounded">
                    {simulatedLevel.toFixed(2)} m
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max={maxCapacityMeters}
                  step="0.05"
                  value={simulatedLevel}
                  onChange={(e) => handleLevelSliderChange(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Arraste o slider para testar a alteração do nível de água e acionar automaticamente os alertas do sistema no LocalStorage.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 3: Histórico Recente de Telemetria */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Telemetria Recente
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
                24 Horas
              </span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {telemetry.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      t.status === 'Emergência' ? 'bg-red-500 animate-ping' :
                      t.status === 'Alerta' ? 'bg-amber-500' :
                      t.status === 'Atenção' ? 'bg-yellow-400' : 'bg-emerald-400'
                    }`} />
                    <div>
                      <div className="font-bold text-white">{t.levelMeters.toFixed(2)} m</div>
                      <div className="text-[10px] text-slate-400">{t.timestamp}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-slate-300">{t.flowRateM3s} m³/s</div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase">{t.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onNavigateToTab('bulletins')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              Consultar Boletins Oficiais →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
