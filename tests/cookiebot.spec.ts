import generateCMPTests from "./runner";

generateCMPTests(
    [
        'https://www.kaufland.de/',
        'https://www.zentrum-der-gesundheit.de/',
        'https://www.wikinger-reisen.de/',
        'https://www.wohnen.de/',
        'https://www.history.de/',
    ].map(site => [site, 'Cybotcookiebot'])
);
