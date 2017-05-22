# floor-viewer-sdk

Work In Progress. For the moment you can go look at the `plain-js` example in the `examples`
directory.

The simple example should work without having to set up an http server. Simply open up in the
browser with the following query parameters:

```
?token=<oauth-token>&floorId=<id>&siteUrl=<ioffice-site>
```

## Angular 4 example

- Navigate to `examples/angular`
- Run `npm install`.
- Run `npm run dev` to start webpack in watch mode.
- Run `npm start` to start a local server (requires Python).
- Navigate to `http://localhost:3001` with the same parameters used in the plain-js example.
