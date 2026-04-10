'use strict';

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

class S3PresignedUrl {
  constructor() {
    this.description = {
      displayName: 'S3 URL Pre-Assinada',
      name: 's3PresignedUrl',
      icon: 'fa:link',
      group: ['transform'],
      version: 1,
      subtitle: '={{$parameter["bucket"] + "/" + $parameter["key"]}}',
      description: 'Gera uma URL pre-assinada (GetObject) para um arquivo no Amazon S3',
      defaults: {
        name: 'S3 URL Pre-Assinada',
        color: '#FF9900',
      },
      inputs: ['main'],
      outputs: ['main'],
      credentials: [
        {
          name: 'aws',
          required: true,
        },
      ],
      properties: [
        {
          displayName: 'Bucket',
          name: 'bucket',
          type: 'string',
          default: '',
          required: true,
          placeholder: 'meu-bucket',
          description: 'Nome do bucket S3. Suporta expressoes n8n (ex: ={{ $json.bucket }}).',
        },
        {
          displayName: 'Key (caminho do arquivo)',
          name: 'key',
          type: 'string',
          default: '',
          required: true,
          placeholder: 'pasta/subpasta/arquivo.pdf',
          description: 'Caminho do arquivo dentro do bucket. Suporta expressoes n8n (ex: ={{ $json.key }}).',
        },
        {
          displayName: 'Expira em (segundos)',
          name: 'expiresIn',
          type: 'number',
          default: 3600,
          description: 'Validade da URL em segundos. Padrao: 3600 (1 hora). Maximo: 604800 (7 dias).',
        },
      ],
    };
  }

  async execute() {
    const items = this.getInputData();
    const returnData = [];

    const credentials = await this.getCredentials('aws');

    const s3Client = new S3Client({
      region: credentials.region || 'sa-east-1',
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
        ...(credentials.sessionToken ? { sessionToken: credentials.sessionToken } : {}),
      },
    });

    for (let i = 0; i < items.length; i++) {
      const bucket    = this.getNodeParameter('bucket', i);
      const key       = this.getNodeParameter('key', i);
      const expiresIn = Number(this.getNodeParameter('expiresIn', i));

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });

      returnData.push({
        json: {
          presigned_url: presignedUrl,
          bucket,
          key,
          expires_in: expiresIn,
          expires_at: new Date(Date.now() + expiresIn * 1000).toISOString(),
        },
      });
    }

    return [returnData];
  }
}

module.exports = { S3PresignedUrl };
