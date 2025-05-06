module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(png|jpg|svg)$': 'jest-transform-stub'
  },
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/mocks/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!axios)/'
  ]
};