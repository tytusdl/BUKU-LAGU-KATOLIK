module.exports = function (api) {
    api.cache.using(() => process.env.NODE_ENV + process.env.BABEL_ENV);
    return {
        presets: ['babel-preset-expo'],
        plugins: [
            ...(process.env.NODE_ENV === 'production' || process.env.BABEL_ENV === 'production'
                ? ['transform-remove-console']
                : []),
        ],
    };
};
