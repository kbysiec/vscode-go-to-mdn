# Go to MDN

The extension is a complement for feature added in version 1.38 (August 2019 release) - [MDN Reference for HTML and CSS](https://code.visualstudio.com/updates/v1_38#_mdn-reference-for-html-and-css).
It allows user to browse MDN web docs directly from Visual Studio Code using command palette.

The data comes from [MDN Github repository](https://github.com/mdn/browser-compat-data).
Big thanks for MDN and all contributors for great job.

Due to big amount of data, they are downloaded once the user asks for them and cached after that.
Second call and other calls will be fed from cache.
This approach allows to keep the extension responsive.

## Features

The data provided in extension are limited to the ones with valid url in MDN github repository mentioned at the beginning.
Once confirming the interested item, the default browser will be opened with direct url according your request.

![Preview of the browse feature](img/browse_flat.gif)

If you do not find what you are looking for, you could just type the term you are looking, press Enter and you MDN web docs
website will be opened with search results for your query.

![Preview of the search feature](img/search.gif)

## Commands

- `goToMDN.browse`

  Search any text or browse available data downloaded from MDN API.

- `goToMDN.clearCache`

  If you know that the cached data is outdated, clear extension cache to download it one more time.

## Release Notes

Please check changelog for release details.

## Author

[Kamil Bysiec](https://github.com/kbysiec)

## Acknowledgment

If you found it useful somehow, I would be grateful if you could leave a "Rating & Review" in Marketplace or/and leave a star in the project's GitHub repository.

Thank you.
