# Política de Segurança do Registra Lá

## Versões Suportadas

Atualmente, as seguintes versões do Registra Lá estão recebendo atualizações de segurança:

| Versão | Suportada          |
| ------ | ------------------ |
| 1.x.x  | :white_check_mark: |

## Práticas de Segurança

O Registra Lá implementa as seguintes práticas de segurança:

### Proteção de Dados

- Todos os dados de registro de ponto são armazenados localmente no dispositivo do usuário.
- As fotos de registro são armazenadas de forma segura no armazenamento do dispositivo.
- A chave da API Gemini é armazenada de forma segura e nunca é compartilhada.

### Permissões do Aplicativo

O aplicativo solicita apenas as permissões necessárias para seu funcionamento:

- Câmera: para capturar fotos de registro de ponto
- Armazenamento: para salvar fotos e dados de registro
- Localização (opcional): para registrar a localização do ponto

### Comunicação com APIs Externas

- Toda comunicação com a API Gemini é feita através de conexões seguras (HTTPS).
- Nenhum dado pessoal é enviado para servidores externos sem o consentimento explícito do usuário.

## Melhores Práticas para Usuários

1. Mantenha o aplicativo atualizado com a versão mais recente.
2. Não compartilhe sua chave da API Gemini com terceiros.
3. Configure um bloqueio de tela seguro em seu dispositivo.
4. Faça backups regulares dos seus dados de registro.
5. Revise periodicamente os registros de ponto para identificar possíveis anomalias.

## Atualizações desta Política

Esta política de segurança pode ser atualizada periodicamente. Verifique este documento regularmente para se manter informado sobre nossas práticas de segurança.

---

Última atualização: 02/09/2025
