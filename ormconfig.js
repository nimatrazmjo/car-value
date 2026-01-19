const path = require('path');

const dbConfig = {
  synchronize: true,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [path.join(__dirname, 'src', '**', '*.entity.ts')],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: [path.join(__dirname, 'src', '**', '*.entity.ts')],
      synchronize: true,
      dropSchema: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [path.join(__dirname, 'dist', '**', '*.entity.js')],
      synchronize: false, // Never use synchronize in production
    });
    break;
  default:
    console.log('Current Environment:', process.env.NODE_ENV);
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [path.join(__dirname, 'src', '**', '*.entity.ts')],
    });
    break;
}

module.exports = dbConfig;
