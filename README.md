# Tinybird Frontend Test

![Tinybird logo](assets/tinybird_logo.png)

This repository contains the technical test made for [Tinybird](https://www.tinybird.co/). To start, please read the `Instructions` section.

![Tests workflow](https://github.com/nelodev/tinybird_test/actions/workflows/running-tests.yml/badge.svg)

## 📝 Instructions

First of all, install the prettier dependency with 👇

```console
  npm install
```

If you want to run the tests, just run them with 👇

```console
  npm test
```

If you want to format the code, just format it with 👇

```console
  npm run format
```

🌈 Finally, start the application opening the `index.html` file 🌈

## 📈 Improvements

- Investigate why JSDOM is not executing `<script>` tag in order to test interaction with tinybird endpoint
- Add tests interacting with the filters (some example tests already commented in `src/tests/index.test.js`)
- Investigate how to improve functions inside `index.js` in order to do unit tests

## 🔜 New functionalities

- Add functionality for create your own filters dinamically without having to modify sql query in `index.js`
- Add chart.js in order to compare data between drivers more beautifully with charts
