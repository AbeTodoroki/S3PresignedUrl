'use strict';

const { S3PresignedUrl } = require('./nodes/S3PresignedUrl/S3PresignedUrl.node');

module.exports = { nodeTypes: [S3PresignedUrl] };
