# Bishop
Bishop is a Chrome extension that will hunt websites you browse for files that contain a given string - it will find you Git repos, exposed config files, open `cgi-bin`'s, web accessible `etc/passwd` files, and more.

## Installation

### Automatic
Download from the Chrome Web Store [here](http://example.com).

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

4. Build it!

  `gulp`

This is a singular build; if you want gulp to watch folders for changes and make the appropriate build changes, run `gulp watch` (this will *not* hint your js on build; the default will).

Files in the `/src` folder will be built in the `dist` folder. The dist folder is then ready to be compressed or imported to Chrome as an unpacked extension.

## Adding Rules to the Code
If you have a general rule that you think others could find helpful, feel free to PR it. The fields are pretty self explanatory and match the GUI rule addition interface. The `uid` field can be left as is; it's just adding the unique ID for the rule. Risk is intended to describe the relative amount of problems scanning the wrong site with the rule could cause -- e.g. getting scanned for open phpMyAdmin installs is pretty much par for the course for 99% of web servers and is low risk, but punching at a bunch of variations of `../../../../../etc/passwd` grabs could irk some people and is high risk. It's all relative, but use your best judgment. 

## Notes
- Bishop is built on sending background XHR requests, many of which will result in 404's. These *will* show up in your console log, so be aware of that when browsing. If you feel comfortable ignoring 404's, you can check the "Hide network messages" box at the top of the console window.

## License
MIT.
