# Bishop
Bishop is a Chrome extension that will hunt websites you browse for files that contain a given string - it will find you Git repos, exposed config files, open `cgi-bin`'s, web accessible `etc/passwd` files, and more.

## Installation

### Automatic
Download from the Chrome Web Store [here](http://example.com).

### Manual
TBD.

## Adding Rules to the Code
If you have a general rule that you think others could find helpful, feel free to PR it. The fields are pretty self explanatory and match the GUI rule addition interface. The `uid` field can be left as is; it's just adding the unique ID for the rule. Risk is intended to describe the relative amount of problems scanning the wrong site with the rule could cause -- e.g. getting scanned for open phpMyAdmin installs is pretty much par for the course for 99% of web servers and is low risk, but punching at a bunch of variations of `../../../../../etc/passwd` grabs could irk some people and is high risk. It's all relative, but use your best judgment. 

## Notes
- Bishop is built on sending background XHR requests, many of which will result in 404's. These *will* show up in your console log, so be aware of that when browsing. If you feel comfortable ignoring 404's, you can check the "Hide network messages" box at the top of the console window.

## License
MIT.