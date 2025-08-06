/**
 * Hook personalizado para gerenciar os registros de ponto.
 * Separa a lógica de negócio da interface.
 */

import { useState, useEffect, useCallback } from 'react';
import { Register } from '@/model/Register';
import { storageService } from '@/services/StorageService';
import { isToday } from '@/utils/dateTime';

/**
 * Hook para gerenciar registros de ponto
 */
export function useRegisters() {
  const [registers, setRegisters] = useState<Register[]>([]);
  const [todayRegisters, setTodayRegisters] = useState<Register[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega todos os registros do banco de dados
   */
  const loadRegisters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allRegisters = await storageService.getAllRegisters();
      setRegisters(allRegisters);
      
      // Filtra registros de hoje
      const today = allRegisters.filter(register => isToday(register.date));
      setTodayRegisters(today);
      
      return allRegisters;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar registros';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carrega registros por data específica
   */
  const loadRegistersByDate = useCallback(async (date: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const dateRegisters = await storageService.getRegistersByDate(date);
      return dateRegisters;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar registros';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Adiciona um novo registro
   */
  const addRegister = useCallback(async (registerData: Partial<Register>) => {
    try {
      setLoading(true);
      setError(null);
      
      const newRegister = await storageService.saveRegister(registerData);
      
      // Atualiza a lista de registros
      setRegisters(prev => [...prev, newRegister]);
      
      // Se o registro for de hoje, atualiza a lista de registros de hoje
      if (isToday(registerData.date!)) {
        setTodayRegisters(prev => [...prev, newRegister]);
      }
      
      return newRegister;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar registro';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Atualiza um registro existente
   */
  const updateRegister = useCallback(async (id: string, registerData: Partial<Register>) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedRegister = await storageService.updateRegister(id, registerData);
      
      // Atualiza a lista de registros
      setRegisters(prev => 
        prev.map(reg => reg.id === id ? updatedRegister : reg)
      );
      
      // Atualiza a lista de registros de hoje se necessário
      setTodayRegisters(prev => {
        const isInToday = prev.some(reg => reg.id === id);
        if (isInToday) {
          return prev.map(reg => reg.id === id ? updatedRegister : reg);
        }
        return prev;
      });
      
      return updatedRegister;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar registro';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Remove um registro
   */
  const removeRegister = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await storageService.deleteRegister(id);
      
      // Atualiza a lista de registros
      setRegisters(prev => prev.filter(reg => reg.id !== id));
      
      // Atualiza a lista de registros de hoje
      setTodayRegisters(prev => prev.filter(reg => reg.id !== id));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover registro';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega os registros ao montar o componente
  useEffect(() => {
    loadRegisters();
  }, [loadRegisters]);

  return {
    registers,
    todayRegisters,
    loading,
    error,
    loadRegisters,
    loadRegistersByDate,
    addRegister,
    updateRegister,
    removeRegister,
  };
}