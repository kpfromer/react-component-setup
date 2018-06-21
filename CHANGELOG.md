# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## 0.2.0 - 2018-06-20
### Added
- Refresh function for `elementsToFind`
- This very changelog!
### Fixed
- Fix readme coverage badge

## 0.1.1 - 2018-06-16
### Fixed
- Fix ES package export

## 0.1.0 - 2018-06-15
### Changed
- SetupComponent to use object as parameter for more defined usage
- Add README section on adding properties to components

## 0.0.3 - 2018-06-14
### Changed
- Remove files from coverage scan
### Fixed
- Fix typos in README
- Fix anchors in README

## 0.0.2 - 2018-06-14
### Added
- npm ignore to reduce module space
### Fixed
- SetupComponent export to stop crashing

## 0.0.1 - 2018-06-14
### Added
- SetupComponent function to create object of `mount` and `shallow`, based on `enzyme`'s for setting up React component tests
- `mount` and `shallow` can accept property values for component
- parameter on `mount` and `shallow` to find elements in component based on query
- default property values for components