module.exports = {
	extends: [`@commitlint/config-conventional`],
	plugins: [`commitlint-plugin-spend`],
	rules: {
		spend: [2, `always`],
	},
};
