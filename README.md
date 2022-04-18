# Tinybird Frontend Test

![Tinybird logo](assets/tinybird_logo.png)

This repository contains the resolution for a test from Tinybird. To start, please check the `Instructions` section.

## 📝 Instructions

Run the following command to install the dependencies 👇

```
npm install
```

And open `index.html`

## 🤔 Why not tests?

I've decided not to add any tests because I've not been able to find a way to test the application with html and js without any framework.
I thought of dividing every functionality into exportable functions in order to be able to do unit tests, but CORS, modules, etc gave me many problems.
In order to don't mess up the test, I decided then to not add any test.

## 🔜 Follow ups

- Migrate the application to any JS framework (Vue, React) in order to provide a much easier testing process
- Add a way of creating your own filters dinamically without having to modify sql query in index.js
