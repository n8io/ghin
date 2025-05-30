# `ghin`

⛳ An unofficial wrapper for the GHIN api

![Downloads](https://img.shields.io/github/downloads/n8io/ghin/total)
[![check-code-coverage](https://img.shields.io/badge/code--coverage-100%25-brightgreen)](https://github.com/n8io/ghin/actions/workflows/publish.yml?query=branch%3Amain)
[![Issues](https://img.shields.io/github/issues/n8io/ghin)](https://github.com/n8io/ghin/issues)
[![License](https://img.shields.io/github/license/n8io/ghin)](https://github.com/n8io/ghin/blob/main/LICENSE)

This TypeScript library provides a convenient and easy-to-use API wrapper for accessing the Golfer Handicap Index Network (GHIN) api unofficially. It allows you to interact with GHIN data, retrieve golfer handicaps, scores, and perform various operations related to golf handicaps.

## Features

- Retrieve golfer handicap information.
- Calculate course handicaps for golfers.
- Search for golfers by name, ID, or other criteria.
- Access golfer scoring history.
- And more!

## Installation

To use this library in your TypeScript project, you can install it via npm:

```shell
npm install ghin
```

## Usage

Here's a quick example of how to use this library:

```typescript
import { GhinClient } from 'ghin';

// Initialize the client
const ghin = new GhinClient({
  password: process.env.PASSWORD,
  username: process.env.USERNAME,
});

// Get a golfer's handicap
const ghinNumber = '1234567';
const { handicap_index } = await ghin.handicaps.getOne(ghinNumber);

console.log(`Golfer ${ghinNumber} has a handicap of ${handicap_index}`);
```

## TODOs

- [x] 🔑 Add client authentication
- [x] ♻️ Add client token auto-refresh
- [x] 💸 Add configurable cache client
- [x] ✨ Add golfer search
- [x] ✨ Add golfer scores fetching
- [x] ✨ Add course handicap fetching
- [x] 💄 Enforce code style for consistency
- [x] ✨ Add course search
- [x] ✨ Add course details fetching
- [ ] 📘 Autogenerated documentation
- [ ] 🧪 Test coverage all the things

## Contributing

We welcome contributions from the community. If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and write tests if applicable.
4. Commit your changes and push them to your fork.
5. Open a pull request to the main repository.

## License

MIT License

Copyright (c) 2023 Nate Clark

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
