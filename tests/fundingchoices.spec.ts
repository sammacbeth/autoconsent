import generateCMPTests from "./runner";

generateCMPTests(
    [
        'https://www.schulferien.org/',
        'https://www.bbc.com/',
        'https://www.accuweather.com/',
    ].map(site => [site, 'funding-choices'])
);
