export default {
    testEnvironment: 'node',
    transform: {},
    // Add these for proper MongoDB test cleanup:
    globalSetup: './src/___test__/setup.js',
    globalTeardown: './src/___test__/teardown.js',
    setupFilesAfterEnv: ['./src/___test__/jest.setup.js'] , 
    reporters: [
        "default",
        ["jest-html-reporters", {
          publicPath: "./html-report",
          filename: "report.html",
          openReport: true,
        }]
      ]
  }