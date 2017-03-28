# Release

Update "version" of package.json and change unreleased section of [CHANGELOG.md](https://github.com/yuku-t/textcomplete/blob/master/CHANGELOG.md) to the new version. Then,

```bash
yarn run prepare
yarn publish
yarn run gh-release
```
