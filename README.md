# LLight

### Options `ll.init({options})`
- `routing: bool`
- `debug: bool`

### Attributes

| attibute      | value            | example |
|---------------|------------------|---------|
| `ll-text`     | `expr`           | `<span ll-text="user.name">`
| `ll-class`    | `class:expr`     | `<div ll-class="bg-warning:isError">`
| `ll-attr`     | `attribute=expr` | `<html ll-attr="data-theme=themeDark?'dark':'light'">`
| `ll-show`     | `expr`           | `<div ll-show="showWarning">`
| `ll-for`      | `expr`           | `<div ll-for="user.friends.map(f => f.name)">`
| `ll-for-here` |                  | `<div ll-for-here>`
| `ll-bind`     | `var`            | `<input type="text" ll-bind="textInput">`
| `ll-@click`   | `expr`           | `<button ll-@click="alert('clicked!')">`
| `ll-@enter`   | `expr`           | `<input type="text" ll-@enter="search()">`
| `ll-route`    | `/route`         | `<div ll-route="/about">`
| `ll-goto`     | `/route`         | `<a ll-goto="/about">`

### Utils `ll._.<fn>`
- `ll._.randArray(array, n = 1)` sample from array
- `ll._.randInt(min, max)` inclusive
- `ll._.randFloat(min, max)` max exclusive