# Catechism of the Catholic Church:

_A proof-of-concept of how the Catechism can be presented online in a more user-friendly way._

## Development

### Dependencies

- [Deno](https://deno.land/)

### Useful tools

- [Deno extension for VS Code](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)

### Tasks

- `deno fmt` (all code is formatted with this)
- `deno test`
- `deno task build-mock-data` (see [`./catechism/mock-data/README.md`]())
- `deno task web-app-start` (for running the web app locally)

### Committing changes

Commit messages should follow the following pattern:

```
type(scope): details

more details (optional)
```

Where `type` is one of:

- `chore`
- `docs`
- `build`
- `feat`
- `fix`
- `refactor`
- `style`

## Potentially useful links

- [Catechism of the Catholic Church, Libreria Editrice Vaticana](http://www.vatican.va/archive/ENG0015/_INDEX.HTM)
- [Catechism of the Catholic Church, USCCB](https://www.usccb.org/beliefs-and-teachings/what-we-believe/catechism/catechism-of-the-catholic-church)
- [Catechism of the Catholic Church, St. Charles Borromeo Catholic Church](https://scborromeo2.org/catechism-of-the-catholic-church)
- [cccef.com: a user-friendly wrapper around the St. Charles Borromeo website](http://cccref.com/)
- [catechism-ccc-json repository](https://github.com/nossbigg/catechism-ccc-json)
- [Reddit Catechism bot](https://github.com/konohitowa/catebot)
- [Something that generates a random paragraph from the Catechism of the Catholic Church](https://github.com/regdoug/ccc)
- [Golang library of the Catechism of the Council of Trent](https://github.com/mborders/romanus)
