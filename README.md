# n8n-nodes-s3-presign

Custom n8n node para gerar **URLs pré-assinadas** (presigned URLs) de objetos no **Amazon S3**, permitindo acesso temporário a arquivos privados sem expor credenciais.

## Instalação no n8n

### Via Interface do n8n (recomendado)

1. Acesse **Settings → Community Nodes → Install**
2. Digite o nome do pacote: `n8n-nodes-s3-presignedurl`
3. Clique em **Install**
4. Reinicie o n8n quando solicitado

### Via linha de comando

```bash
cd ~/.n8n/custom
npm install n8n-nodes-s3-presign
# Reinicie o n8n
```

### Via GitHub (sem publicar no npm)

```bash
cd ~/.n8n/custom
npm install github:SEU_USUARIO/n8n-nodes-s3-presign
# Reinicie o n8n
```

## Configuração

### 1. Credencial AWS

Crie uma credencial do tipo **AWS** no n8n (Settings → Credentials → New → AWS) com:

- **Region**: ex: `sa-east-1`
- **Access Key ID**: sua chave de acesso AWS
- **Secret Access Key**: sua chave secreta AWS

A IAM policy mínima necessária:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::SEU-BUCKET/*"
    }
  ]
}
```

### 2. Parâmetros do node

| Campo | Obrigatório | Descrição | Exemplo |
|---|---|---|---|
| **Bucket** | Sim | Nome do bucket S3 | `meu-bucket` |
| **Key** | Sim | Caminho do arquivo no bucket | `docs/relatorio.pdf` |
| **Expira em (segundos)** | Não | Validade da URL (padrão: 3600) | `86400` |

Todos os campos suportam expressões n8n:
- `={{ $json.bucket }}`
- `={{ $json.key }}`

## Output

```json
{
  "presigned_url": "https://meu-bucket.s3.sa-east-1.amazonaws.com/docs/relatorio.pdf?X-Amz-Algorithm=...",
  "bucket": "meu-bucket",
  "key": "docs/relatorio.pdf",
  "expires_in": 3600,
  "expires_at": "2026-04-10T16:00:00.000Z"
}
```

## Uso como SubWorkflow

Este node é ideal para ser chamado por outros workflows via **Execute Workflow**:

```
[Workflow Pai]
    → [Execute Workflow: S3 URL Pre-Assinada]
        input:  { bucket, key, expires_in }
        output: { presigned_url, expires_at }
```

## Licença

MIT
