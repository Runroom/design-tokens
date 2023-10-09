const config = {
  roots: ['<rootDir>'],
  verbose: true,
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['js', 'ts'],
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/tests/**/*.test.{js,ts}'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}']
};

export default config;
