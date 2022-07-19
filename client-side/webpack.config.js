const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
// file_name should be lowercase and if it more then one word put '_' between them,
const addonConfig = require('../addon.config.json');
const blockName = `file_${addonConfig.AddonUUID.replace(/-/g, '_').toLowerCase()}`;

const webpackConfig = withModuleFederationPlugin({
    name: blockName,
    filename: `${blockName}.js`,
    exposes: {
        './ScriptBlockClientModule': './src/app/block/index.ts',
        './ScriptBlockClientEditorModule': './src/app/block-editor/index.ts',
    },
    shared: {
        ...shareAll({ strictVersion: true, requiredVersion: 'auto' }),
    }
});

module.exports = {
    ...webpackConfig,
    output: {
        ...webpackConfig.output,
        uniqueName: blockName,
    },
};
