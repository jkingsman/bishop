function startIntro() {
    var intro = introJs();
    intro.setOptions({
        steps: [{
            intro: "Welcome to Bishop!"
        }, {
            element: '#vulnerableSites',
            intro: "This is where vulnerable sites will appear."
        }, {
            element: '#ruleBox',
            intro: "This contains the rules that Bishop will test sites against.",
            position: 'bottom'
        }, {
            element: '#delayBox',
            intro: 'This is the delay between each rule test. If your browser is running slowly, try increasing this.',
            position: 'top'
        }, {
            element: '#excludeBox',
            intro: "This is the exclusion list. If you are finding too many false positives on a site, or you don't want to scan it (think fbi.gov), add it here.",
            position: 'top'
        }, {
            element: '#addDemoRules',
            intro: "This adds and enables a varied set of rules to get started with, and is a great first step.",
            position: 'top'
        }, {
            element: '#beggingBox',
            intro: 'This project is open source! Happy scanning!',
            position: 'top'
        }]
    });

    intro.start();
}