const config = {
  roots: ['<rootDir>'],
  verbose: true,
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['js', 'ts'],
  preset: 'ts-jest',
  testMatch: [
    '<rootDir>/**/tests/**/*.test.{js,ts}',
  ],
};

export default config;
