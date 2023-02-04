# The Catechism of the Catholic Church

This contains the Catechism of the Catholic Church in an arrangement that decouples its text and structure as much as
possible. All information necessary for a visual rendering of the content is provided.

## Contents

- `./source`: the main product: the text of the Catechism and related files
- `./utils`: utilities for creating mock data and the source code
- `./resources`: miscellaneous files not directly related to the source code

## Development

### Dependencies

- [Deno](https://deno.land/)

### Useful tools

- [Deno extension for VS Code](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)

### Tasks

- `deno fmt` (all code is formatted with this)
- `deno test`
- `deno task build-mock-data` (see [`./utils/mock-data/README.md`]())

## Potentially useful links

- [Catechism of the Catholic Church, Libreria Editrice Vaticana](http://www.vatican.va/archive/ENG0015/_INDEX.HTM)
- [Catechism of the Catholic Church, St. Charles Borromeo Catholic Church](https://scborromeo2.org/catechism-of-the-catholic-church)
- [Catechism of the Catholic Church, USCCB](https://www.usccb.org/beliefs-and-teachings/what-we-believe/catechism/catechism-of-the-catholic-church)
- [catechism-ccc-json repository](https://github.com/nossbigg/catechism-ccc-json)
- [Reddit Catechism bot](https://github.com/konohitowa/catebot)
- [Something that generates a random paragraph from the Catechism of the Catholic Church](https://github.com/regdoug/ccc)
- [Golang library of the Catechism of the Council of Trent](https://github.com/mborders/romanus)
