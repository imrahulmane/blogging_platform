export default() => ({
  db:{
      host: process.env.DB_HOST,
      type: 'postgres',
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCRONIZE === 'true' || true,
      // logging: process.env.DB_LOGGING === 'true',
      migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',
      // migrationsDir: [process.env.DB_MIGRATIONS_DIR],
      retryAttempts: 5,  // Explicitly set retryAttempts
      retryDelay: 3000,  // Delay between retries
      extra: {
        charset: 'utf8mb4_unicode_ci',
      }
  },
  });