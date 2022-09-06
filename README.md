## Description

Set of JavasScript utilities, modular, performant, and easy to use.

## Install

**npm**

```sh
npm i @mdor/js-extensions -S
npm install @mdor/js-extensions --save
```

**yarn**

```sh
yarn add @mdor/js-extensions
yarn workspace <workspace-name> @mdor/js-extensions
```

## Documentation

### Object

- #### getFrom
  Extracts a property from any given input, if the property is not present, then a fallback value will be returned.

```js
const user = {
  id: "123123456",
  active: true,
  attributes: {
    name: "Joe",
  },
  trades: [
    {
      id: "werwe224",
      bill: 123454,
    },
  ],
};
const userName = getFrom("attributes.name")(user);
const userFirstBill = getFrom('attributes.trades.[0]["bill"]')(user);
```
