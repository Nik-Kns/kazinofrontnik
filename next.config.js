/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: false,
  },
  webpack: (config) => {
    // Игнорируем опциональные OTEL экспортеры, которых нет в проде
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      '@opentelemetry/exporter-jaeger': false,
      'jaeger-client': false,
      'handlebars': false,
    };
    return config;
  },
};

module.exports = nextConfig;


