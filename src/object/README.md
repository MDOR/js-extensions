## Documentation

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
// output Joe
const userFirstBill = getFrom('attributes?.trades.[0]["bill"]')(user);
// output 123454
const userSecondBill = getFrom('attributes?.trades.[1]["bill"]', 0)(user);
// output 0
```

_Notes:_

- Is recommended to generate a getter to be applied in any future operation.
- Unless you explicitly pass any value different than `undefined`, any result will be valid (including _falsy values_)
