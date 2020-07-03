module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
  },
  browser: 'firefox',
  browserContext: 'default',
}