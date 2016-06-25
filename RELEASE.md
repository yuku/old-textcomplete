# Release

Update "version" of package.json and change unreleased section of [CHANGELOG.md](https://github.com/yuku-t/textcomplete/blob/master/CHANGELOG.md) to the new version. Then,

```bash
npm run prepare
npm publish
npm run gh-release
```
