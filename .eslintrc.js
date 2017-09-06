module.exports = {
    "env": {
    },
    "globals": {
		"console": true,
		"setInterval": true,
		"clearInterval": true,
		"setTimeout": true,
		"setAttrs": true,
		"getAttrs": true,
		"getSectionIDs": true,
		"_": true,
        "on": true,
		"Promise":true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
		"ecmaVersion": 2017,
        "ecmaFeatures": {
			"implitedStrict": true,
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
    ],
    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
