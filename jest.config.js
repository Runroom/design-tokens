const jestConfig = {
  roots: ['<rootDir>'],
  verbose: true,
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['<rootDir>/**/tests/**/*.test.{js,ts}'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,js}'],
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};

export default jestConfig;
