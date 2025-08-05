/**
 * Centralização de mensagens utilizadas no aplicativo.
 * Facilita a manutenção e padronização de textos.
 */

export const Messages = {
  errors: {
    database: {
      save: 'Erro ao salvar no banco de dados',
      load: 'Erro ao carregar dados do banco de dados',
      delete: 'Erro ao excluir dados do banco de dados',
      update: 'Erro ao atualizar dados no banco de dados',
    },
    config: {
      save: 'Erro ao salvar a configuração',
      load: 'Erro ao carregar a configuração',
    },
    register: {
      create: 'Erro ao criar registro',
      update: 'Erro ao atualizar registro',
      delete: 'Erro ao excluir registro',
      load: 'Erro ao carregar registros',
    },
    validation: {
      requiredField: 'Este campo é obrigatório',
      invalidFormat: 'Formato inválido',
      invalidValue: 'Valor inválido',
    },
    network: {
      connection: 'Erro de conexão',
      timeout: 'Tempo de conexão esgotado',
    },
    update: {
      check: 'Erro ao verificar atualizações',
      download: 'Erro ao baixar atualização',
      install: 'Erro ao instalar atualização',
    },
  },
  success: {
    config: {
      save: 'Configuração salva com sucesso',
    },
    register: {
      create: 'Registro criado com sucesso',
      update: 'Registro atualizado com sucesso',
      delete: 'Registro excluído com sucesso',
    },
    update: {
      installed: 'Atualização instalada com sucesso',
    },
  },
  confirmations: {
    delete: 'Tem certeza que deseja excluir este item?',
    update: 'Tem certeza que deseja atualizar o aplicativo?',
    exit: 'Tem certeza que deseja sair?',
  },
};