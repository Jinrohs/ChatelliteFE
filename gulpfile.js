'use strict';

const bs = require('browser-sync').create();
const config = require('./package.json');
const gulp = require('gulp');
const named = require('vinyl-named');
const plumber = require('gulp-plumber');
const server = require('gulp-develop-server');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

let mode = 'production';

const paths = {
    scriptEndpoints: [
        './source/main.js',
    ],
    scripts: [
        './source/**/*.js',
    ],
    server: './server/run.js',
    serverFiles: [
        './server/*.js',
        './server/views/*.pug',
        './server/controllers/*.js',
        './server/resouces/*.js'
    ],
    resources: [
        './server/public/*.css'
    ],
};

const uglifyConfig = {
    compress: {
        dead_code: true,
        global_defs: {
            DEBUG: mode === 'production' ? 'prod' : 'dev',
            LOCAL: false,
        },
    },
};

const webpackConfigs = {
    development: {
        output: {
            filename: 'development/[name].js',
        },
        devtool: 'source-map',
    },
    production: {
        output: {
            filename: `${config.version}/[name].js`,
        },
        watch: false,
        plugins: [
            new webpack.optimize.UglifyJsPlugin(uglifyConfig),
        ],
    },
};

const browserSyncConfig = {
    proxy: 'http://localhost:4444',
    port: 4445,
    open: true,
};

function setMode(nextMode) {
    return function setMode(done) {
        mode = nextMode;
        done();
    };
}

function serverStart(done) {
    server.listen({ path: paths.server }, () => {
        bs.init(browserSyncConfig);
        done();
    });
}

function serverRestart(done) {
    server.restart((error) => {
        if (!error) {
            bs.reload();
        }
        done();
    });
}

function scripts() {
    return gulp.src(paths.scriptEndpoints)
        .pipe(plumber())
        .pipe(named())
        .pipe(webpackStream(webpackConfigs[mode]))
        .pipe(gulp.dest('./builds'))
        .pipe(bs.stream());
}

function watch() {
    gulp.watch(paths.scripts, scripts);
    gulp.watch(paths.serverFiles, serverRestart);
    gulp.watch(paths.resources, reload);
}

function reload() {
    return gulp.src(paths.resources)
        .pipe(bs.stream());
}

gulp.task('production', gulp.series(
    setMode('production'),
    scripts
));

gulp.task('development', gulp.series(
    setMode('development'),
    scripts,
    serverStart,
    watch
));

gulp.task('default', gulp.series(
    setMode('development'),
    scripts,
    serverStart,
    watch
));
