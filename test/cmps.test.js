const { testCmpOptOut } = require("./helpers");

const CMPS = {
  Cybotcookiebot: [
    "https://about.gitlab.com",
    "https://www.ab-in-den-urlaub.de/",
    "https://androidfilehost.com/",
    "https://www.avira.com/",
    "https://www.centralpoint.nl/",
    "https://www.deine-tierwelt.de/",
    "https://www.digitaltrends.com/",
    "https://www.vatera.hu/",
    "https://www.smartsheet.com/",
  ],

};

Object.keys(CMPS).forEach((cmp) => {
  describe(cmp, () => {
    CMPS[cmp].forEach((url) => {
      test(
        url,
        () => testCmpOptOut(cmp, url, browser, { screenshot: true }),
        30000
      );
    });
  });
});
