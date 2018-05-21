# avkultra

Example aviation data application using Cesium

## Usage

```
npm install
cp ./config/secrets.{example.json,json}
```

Update `./config/secrets.json` with your keys, etc., then

```
mkdir -p ./dist/cesium && cp -r ./node_modules/cesium/Build/Cesium/* ./dist/cesium
npx webpack
node server/server.js
```

## License

MIT © [Forrest Desjardins](https://github.com/fdesjardins)
