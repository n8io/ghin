# ghin

## 0.6.0

### Minor Changes

- 13b9e58: feat: ✨ Enhance GHIN client with course-related functionalities

  - Added methods to GhinClient for fetching course countries, details, and searching courses.
  - Introduced new models for course countries, courses, geolocation, and request/response schemas.
  - Updated existing golfer search and handicap response models for consistency.
  - Refactored score models to include new score types and statuses with transformations.
  - Improved validation models for date handling and added short date format.

## 0.5.3

### Patch Changes

- b7af36a: fix: 🐛 Allow parsing handicap value as a float

## 0.5.2

### Patch Changes

- cd83df6: fix: 🐛 Allow parsing of `NH` as a handicap value

## 0.5.1

### Patch Changes

- 6be6085: chore: 💚 Remove requirement for pnpm outside of the library

## 0.5.0

### Minor Changes

- 8d8b27b: chore: 🧹 Make unnecessarily public methods private

## 0.4.2

### Patch Changes

- b2ee106: ⬆️ Update all dependency versions

## 0.4.1

### Patch Changes

- fca6032: fix: 🐛 Properly check cached access token's expiration

## 0.4.0

### Minor Changes

- 4843dd5: feat: ✨ Add `cache client` to `GhinClientConfig`

## 0.3.0

### Minor Changes

- 7012722: feat: ✨ Initial alpha release
