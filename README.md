# Bishop
Bishop is a Chrome extension that will hunt websites you browse for files that contain a given string - it will find you Git repos, exposed config files, open `cgi-bin`'s, web accessible `etc/passwd` files, and more.

## Installation

### Automatic
Download from the Chrome Web Store.

[![Image of Chrome Store Badge](https://developer.chrome.com/webstore/images/ChromeWebStore_Badge_v2_340x96.png)](https://chrome.google.com/webstore/detail/cbkdeoaaclnbidadjimofnhpbfhjakoe)

### Manual


> You'll need node and npm set up on your system (which is beyond the scope of this README), and gulp installed (`npm install -g gulp` if you don't already have it).

1. Clone this repo:

  `git clone git@github.com:jkingsman/bishop.git`

2. Move into it:

  `cd bishop`

2. Install the gulp dependencies:

  `npm install`

3. Make sure the build directory is empty:

  `gulp empty`

4. Build it, using any of the following commands:

| `gulp` command  | result |
| ------------- | ------------- |
| `gulp`  | Lint the code and build the `src` directory into the `dist` directory. `dist` can be imported as an unpacked extension  |
| `gulp zip`  | Lint the code and build the `src` directory into the `dist` directory, then zip the `dist` directory into `bishop.zip` in the root `bishop` folder.  |
| `gulp watch`  | Build the `src` directory into the `dist` directory and rebuild on changes to `src`.  |
| `gulp hint`  | Lint all non-lib js. Doesn't build anything; done as part of `gulp`.  |


Files in the `/src` folder will be built in the `dist` folder. The dist folder is then ready to be compressed or imported to Chrome as an unpacked extension.

## Adding Rules to the Code
If you have a general rule that you think others could find helpful, feel free to PR it. The fields are pretty self explanatory and match the GUI rule addition interface. The `uid` field can be left as is; it's just adding the unique ID for the rule. Risk is intended to describe the relative amount of problems scanning the wrong site with the rule could cause -- e.g. getting scanned for open phpMyAdmin installs is pretty much par for the course for 99% of web servers and is low risk, but punching at a bunch of variations of `../../../../../etc/passwd` grabs could irk some people and is high risk. It's all relative, but use your best judgment. 

## Notes
- Bishop is built on sending background XHR requests, many of which will result in 404's. These *will* show up in your console log, so be aware of that when browsing. If you feel comfortable ignoring 404's, you can check the "Hide network messages" box at the top of the console window.

## License
MIT.

***

[![Flattr this](http://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=jkingsman&amp;url=https%3A%2F%2Fgithub.com%2Fjkingsman%2Fbishop) 
