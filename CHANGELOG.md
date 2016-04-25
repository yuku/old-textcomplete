# Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

This change log adheres to [keepachangelog.com](http://keepachangelog.com).

## [0.8.0] - 2016-04-25
### Added
- Let textarea editor deactivate a dropdown on esc key.

## [0.7.1] - 2016-03-30
### Changed
- Use input event instead of keyup event.

### Fixed
- Fix a bug that a typeerror occurs on every normal keydown events.

## [0.7.0] - 2016-03-28
### Added
- Activate hovered dropdown item.
- Add `rotate` dropdown option.

### Changed
- Deactivate an active item by `DropdownItem#activate`.

### Fixed
- Don't trigger textcomplete by pressing shift, ctrl, alt and command keys.

## [0.6.0] - 2016-03-27
### Added
- Add `id` strategy parameter.

### Fixed
- Use [line-height](https://github.com/twolfson/line-height) package to fix a minor dropdown position problem.

## [0.5.1] - 2016-03-20
### Fixed
- Update `gh-pages` automatically when actually `master` branch is changed.
- Make demo page possible to run on Firefox.

## [0.5.0] - 2016-03-14
### Changed
- Divide Editor#move event into Editor#move and Editor#enter events.
- Prefer underscore over hyphen as file name.

## [0.4.0] - 2016-03-14
### Added
- Enable to preload third party editor classes via `Textcomplete.editors`.
- Enable to select dropdown by tab key.

### Changed
- Use methods instead of getter properties to define `Editor` class.
- Emit a custom event on Editor#change and Editor#move event.

### Fixed
- Fix dropdown position when window is scrolled.

## [0.3.0] - 2016-03-10
### Added
- Add "Getting Started", "Development" and "Events" documents.
- Add a contributing guide.
- Add `Dropdown#el` and `Dropdown#getActiveItem()` to its public interface.
- Add `render`, `select` and `selected` events to `Textcomplete`.
- Add `preventDefault` functionality to infinitive events.
- Enable to finalize `Textcomplete`.

### Changed
- Don't hide dropdown on blur event by default.
- Don't activate the first dropdown item by default.
- Emit `rendered` event whenever dropdown is rendered.

### Removed
- Remove `Dropdown#length`.
- Remove `Dropdown#selectActiveItem()`.

## [0.2.0] - 2016-02-29
### Added
- Enable to select dropdown in touch devices.
- Enable to use markdown in jsdoc.
- Add `cache`, `context` strategy parameters.
- Add `className`, `style`, `maxCount`, `header` and `footer` dropdown options.
- Add `show`, `shown`, `rendered`, `hide` and `hidden` events to `Textcomplete`.
- Support "rtl" textarea.

### Changed
- Exclude src/doc from Inch CI.

## [0.1.2] - 2016-02-22
### Added
- Add [jsdoc](https://github.com/jsdoc3/jsdoc) to `gh-pages`.

### Changed
- Use separated lodash npm packages instead of whole lodash code.

## [0.1.1] - 2016-02-22
### Added
- This CHANGELOG file.
- Update `gh-pages` automatically when `master` branch is changed.
- Create a corresponding GitHub release whenever a new npm package is published.

### Fixed
- Enable to require as a npm package.
- Don't lint js files in `dist/`, `lib/` and `powered-test/`.

## 0.1.0 - 2016-02-20 [YANKED]
### Added
- Initial release.

[0.8.0]: https://github.com/yuku-t/textcomplete/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/yuku-t/textcomplete/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/yuku-t/textcomplete/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/yuku-t/textcomplete/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/yuku-t/textcomplete/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/yuku-t/textcomplete/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/yuku-t/textcomplete/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/yuku-t/textcomplete/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/yuku-t/textcomplete/compare/v0.1.2...v0.2.0
[0.1.2]: https://github.com/yuku-t/textcomplete/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/yuku-t/textcomplete/compare/83a55de...v0.1.1
