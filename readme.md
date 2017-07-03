## Installation

```
npm install -g webpack
npm install
```

## Usage

```
cp ./config/secrets.{example.json,json}
```

Update `./config/secrets.json` with your keys, etc., then

```
mkdir -p ./dist/cesium && cp -r ./node_modules/cesium/Build/Cesium/* ./dist/cesium
webpack
node server/server.js
```

## License

MIT © [Forrest Desjardins](https://github.com/fdesjardins)
