export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'JobPulse India REST API',
    version: '1.0.0',
    description:
      'Production-Ready Government & Private Jobs Alert Platform API for India. Supports verified central/state government recruitments, private sector careers, job alerts, resumes, and admin moderation.'
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'token'
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Liveness check',
        responses: { '200': { description: 'Service is alive' } }
      }
    },
    '/health/readiness': {
      get: {
        summary: 'Readiness check for database and providers',
        responses: { '200': { description: 'All systems ready' } }
      }
    },
    '/auth/register': {
      post: {
        summary: 'Register new user account',
        responses: { '201': { description: 'User registered' } }
      }
    },
    '/auth/login': {
      post: {
        summary: 'User login with email and password',
        responses: { '200': { description: 'Login successful' } }
      }
    },
    '/auth/me': {
      get: {
        summary: 'Get current authenticated user profile',
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: { '200': { description: 'User details' } }
      }
    },
    '/jobs': {
      get: {
        summary: 'Search & filter all jobs (central/state/private)',
        parameters: [
          { name: 'q', in: 'query', schema: { type: 'string' } },
          { name: 'sector', in: 'query', schema: { type: 'string' } },
          { name: 'state', in: 'query', schema: { type: 'string' } },
          { name: 'categorySlug', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } }
        ],
        responses: { '200': { description: 'Paginated job listings' } }
      }
    },
    '/jobs/government': {
      get: {
        summary: 'Filter government jobs only (Central, State, Banking, Defence, Railway, PSU, Police)',
        responses: { '200': { description: 'Government job listings' } }
      }
    },
    '/jobs/private': {
      get: {
        summary: 'Filter private sector jobs only (IT, Finance, Engineering, Healthcare, etc.)',
        responses: { '200': { description: 'Private job listings' } }
      }
    },
    '/jobs/{slugOrId}': {
      get: {
        summary: 'Get full job posting details and attachments',
        parameters: [{ name: 'slugOrId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Job details' } }
      }
    },
    '/organizations': {
      get: {
        summary: 'List verified employers and government recruitment authorities',
        responses: { '200': { description: 'Organizations list' } }
      }
    },
    '/categories': {
      get: {
        summary: 'List job categories with active job counts',
        responses: { '200': { description: 'Categories list' } }
      }
    },
    '/bookmarks': {
      get: {
        summary: 'List user bookmarked jobs',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Bookmarks list' } }
      }
    },
    '/alerts': {
      get: {
        summary: 'List user configured job alerts',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Alerts list' } }
      },
      post: {
        summary: 'Create custom job alert',
        security: [{ bearerAuth: [] }],
        responses: { '201': { description: 'Alert created' } }
      }
    },
    '/admin/dashboard': {
      get: {
        summary: 'Administrative metrics and operational health',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Admin metrics' } }
      }
    }
  }
};
